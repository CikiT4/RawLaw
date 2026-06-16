import { createClient } from '@supabase/supabase-js';
import { generateGeminiContent } from '../geminiClient.js';
import { handleOptions, sendJson, supabaseRest, supabaseServiceKey, supabaseUrl } from '../_runtime.js';

const LANGUAGE_INSTRUCTIONS = {
  id: 'Jawab seluruhnya dalam Bahasa Indonesia yang profesional dan mudah dipahami.',
  en: 'Respond entirely in professional, clear English.',
  ja: '専門的で分かりやすい日本語で回答してください。',
  zh: '请使用专业、清晰的中文回答。'
};

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  if (!header.toLowerCase().startsWith('bearer ')) return '';
  return header.slice(7).trim();
}

async function requireAuth(req) {
  const token = bearerToken(req);
  const url = supabaseUrl();
  const serviceKey = supabaseServiceKey();
  if (!token || !url || !serviceKey) {
    const e = new Error('Sesi tidak valid.');
    e.code = 'UNAUTHORIZED';
    throw e;
  }

  const client = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user?.id) {
    const e = new Error('Sesi tidak valid.');
    e.code = 'UNAUTHORIZED';
    throw e;
  }
  return data.user.id;
}

function buildSystemPrompt({ knowledgeContext, lawyerContext, language = 'id' }) {
  const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.id;

  return `Anda adalah Rusdi, asisten hukum digital Indonesia.
Tugas Anda:
- Menjelaskan masalah hukum secara umum
- Membantu brainstorming kasus
- Memberikan edukasi hukum
- Membantu menemukan lawyer yang sesuai

${languageInstruction}

REFERENSI HUKUM (RAG):
${knowledgeContext}

Batasan Penting:
- Anda BUKAN pengacara/advokat berlisensi.
- Jangan pernah mengaku sebagai pengacara atau memiliki lisensi advokat.
- Jangan menjamin hasil perkara atau memberikan kepastian hukum.
- Jangan mengarang pasal, undang-undang, putusan pengadilan, atau nama lawyer.
- Jika informasi tidak cukup, katakan secara ramah bahwa informasi belum cukup untuk memberikan jawaban yang akurat.
- Jika pengguna menjelaskan suatu kasus, wajib gunakan format respons berikut secara persis:

Ringkasan Masalah:
[Fakta utama kasus]

Bidang Hukum Terkait:
[Perdata, Pidana, Bisnis, dll.]

Kemungkinan Dasar Hukum:
[Dasar hukum umum, hindari mengada-ada]

Langkah yang Dapat Dipertimbangkan:
[Rekomendasi langkah awal non-formal]

Risiko yang Perlu Diperhatikan:
[Risiko-risiko potensial]

Rekomendasi:
[Saran tindak lanjut, termasuk menyarankan konsultasi dengan advokat resmi]

- Jika pengguna meminta lawyer:
  Analisis masalah terlebih dahulu, tentukan bidang hukum relevan, lalu rekomendasikan maksimal 3 lawyer yang paling sesuai dari daftar di bawah ini. Sebutkan ID mereka dan jelaskan alasan rekomendasi dengan jelas.

DAFTAR LAWYER YANG TERSEDIA:
${lawyerContext}`;
}

async function ensureConversation(conversationId, userId, title) {
  try {
    await supabaseRest('POST', 'ai_conversations?on_conflict=id', {
      id: conversationId,
      user_id: userId,
      title: (title || 'Percakapan Rusdi').slice(0, 120),
      is_archived: false,
      updated_at: new Date().toISOString()
    });
    return true;
  } catch {
    try {
      await supabaseRest('POST', 'ai_conversations', {
        id: conversationId,
        user_id: userId,
        title: (title || 'Percakapan Rusdi').slice(0, 120),
        is_archived: false
      });
      return true;
    } catch {
      return false;
    }
  }
}

async function loadConversationHistory(conversationId) {
  const rows = await supabaseRest(
    'GET',
    `ai_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&select=role,content&order=created_at.asc&limit=15`
  ).catch(() => []);

  if (rows?.length) return rows;

  return supabaseRest(
    'GET',
    `ai_chat_history?session_id=eq.${encodeURIComponent(conversationId)}&select=role,message&order=timestamp.asc&limit=15`
  ).catch(() => []);
}

async function persistTurn({ conversationId, userId, userMessage, assistantMessage, title }) {
  const conversationReady = await ensureConversation(conversationId, userId, title || userMessage.slice(0, 60));

  if (conversationReady) {
    try {
      await supabaseRest('POST', 'ai_messages', {
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        content: userMessage
      });
      await supabaseRest('POST', 'ai_messages', {
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        content: assistantMessage
      });
      await supabaseRest('PATCH', `ai_conversations?id=eq.${encodeURIComponent(conversationId)}`, {
        title: (title || userMessage.slice(0, 60)).slice(0, 120),
        updated_at: new Date().toISOString()
      }).catch(() => null);
      return true;
    } catch {
      // Fallback below
    }
  }

  const legacySaved = await Promise.all([
    supabaseRest('POST', 'ai_chat_history', {
      session_id: conversationId,
      user_id: userId,
      role: 'user',
      message: userMessage
    }).catch(() => null),
    supabaseRest('POST', 'ai_chat_history', {
      session_id: conversationId,
      user_id: userId,
      role: 'assistant',
      message: assistantMessage
    }).catch(() => null)
  ]);
  return legacySaved.some(Boolean);
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const userId = await requireAuth(req);
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { message, sessionId, conversationId, inlineData, language = 'id' } = body;
    const activeConversationId = conversationId || sessionId;

    if (!message || !message.trim()) {
      sendJson(res, 400, { error: 'Pesan wajib diisi' });
      return;
    }

    if (!activeConversationId) {
      sendJson(res, 400, { error: 'Conversation ID wajib disediakan' });
      return;
    }

    const history = await loadConversationHistory(activeConversationId);

    const lawyers = await supabaseRest(
      'GET',
      'lawyer_directory?verification_status=eq.verified&select=id,name,specialty,experience_years,consultation_price,description,is_online,rating,review_count'
    ).catch(() => []);

    const knowledgeBase = await supabaseRest(
      'POST',
      'rpc/search_knowledge',
      { search_query: message, max_results: 5 }
    ).catch(() => []);

    const lawyerContext = lawyers?.length
      ? lawyers.map((l) => `- ID: ${l.id}\n  Nama: ${l.name}\n  Spesialisasi: ${l.specialty}\n  Pengalaman: ${l.experience_years} tahun\n  Rating: ${l.rating || 0} (${l.review_count || 0} ulasan)\n  Harga: Rp ${Number(l.consultation_price || 0).toLocaleString('id-ID')}\n  Deskripsi: ${l.description || 'Tidak ada deskripsi'}\n  Status: ${l.is_online ? 'Online' : 'Offline'}`).join('\n\n')
      : 'Tidak ada lawyer terdaftar saat ini.';

    const knowledgeContext = knowledgeBase?.length
      ? knowledgeBase.map((kb) => `[Kategori: ${kb.category}]\n${kb.content}`).join('\n\n')
      : 'Tidak ada referensi data hukum yang spesifik untuk saat ini.';

    const systemPrompt = buildSystemPrompt({ knowledgeContext, lawyerContext, language });

    const geminiMessages = [];
    if (history?.length) {
      history.forEach((h) => {
        geminiMessages.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content || h.message }]
        });
      });
    }

    const userParts = [{ text: message }];
    if (inlineData?.data && inlineData?.mimeType) {
      userParts.push({
        inlineData: {
          mimeType: inlineData.mimeType,
          data: inlineData.data
        }
      });

      await supabaseRest('POST', 'ai_file_uploads', {
        conversation_id: activeConversationId,
        user_id: userId,
        name: inlineData.name || 'attachment',
        file_url: `inline://${inlineData.name || 'attachment'}`,
        file_type: inlineData.mimeType,
        analysis_status: 'processed'
      }).catch(() => null);
    }

    geminiMessages.push({ role: 'user', parts: userParts });

    const apiKey = process.env.GEMINI_API_KEY || '';
    const { text: aiResponse } = await generateGeminiContent({
      apiKey,
      payload: {
        contents: geminiMessages,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      },
      language
    });

    const displayUserMessage = inlineData?.name
      ? `[Mengirim file: ${inlineData.name}]\n${message}`.trim()
      : message;

    let persisted = false;
    try {
      persisted = await persistTurn({
        conversationId: activeConversationId,
        userId,
        userMessage: displayUserMessage,
        assistantMessage: aiResponse,
        title: message.slice(0, 60)
      });
    } catch (persistError) {
      console.error('[rusdi/chat] persist failed (non-fatal):', persistError);
    }

    sendJson(res, 200, {
      response: aiResponse,
      sessionId: activeConversationId,
      conversationId: activeConversationId,
      persisted
    });
  } catch (error) {
    const code = error?.code || 'UNKNOWN';
    const upstreamStatus = error?.upstreamStatus || undefined;
    const upstreamBody = error?.upstreamBody || undefined;
    const totalAttempts = error?.totalAttempts || undefined;
    console.error('[rusdi/chat]', {
      code,
      upstreamStatus,
      upstreamBody,
      totalAttempts,
      message: error instanceof Error ? error.message : String(error)
    });
    const message = error instanceof Error ? error.message : 'Gagal memproses request AI';
    const status = code === 'GEMINI_QUOTA'
      ? 429
      : code === 'GEMINI_UNAVAILABLE' || code === 'GEMINI_EMPTY'
        ? 503
        : code === 'UNAUTHORIZED'
          ? 401
          : code === 'GEMINI_NO_KEY'
            ? 500
            : 502;
    sendJson(res, status, {
      error: message,
      retryable: status === 503,
      code,
      upstreamStatus,
      upstreamBody,
      totalAttempts
    });
  }
}
