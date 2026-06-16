import { handleOptions, requireAuthenticatedProfile, sendJson, supabaseRest } from './_runtime.js';

const ACTIVE_CALL_STATUSES = new Set(['paid', 'ongoing', 'in_review']);

async function requireCallableConsultation(req, consultationId) {
  if (!consultationId) throw new Error('Consultation ID wajib tersedia.');

  const { userId, profile } = await requireAuthenticatedProfile(req);
  const rows = await supabaseRest(
    'GET',
    `app_consultations?id=eq.${encodeURIComponent(consultationId)}&select=id,client_id,lawyer_id,status,app_payments(status)&limit=1`
  );
  const consultation = rows?.[0];
  if (!consultation) throw new Error('Konsultasi tidak ditemukan.');

  const isParticipant = consultation.client_id === userId || consultation.lawyer_id === userId;
  if (!isParticipant && profile.role !== 'admin') {
    throw new Error('Anda bukan peserta konsultasi ini.');
  }

  const hasPaidPayment = (consultation.app_payments || []).some((payment) => payment.status === 'paid');
  if (!ACTIVE_CALL_STATUSES.has(consultation.status) && !hasPaidPayment) {
    throw new Error('Panggilan hanya tersedia setelah pembayaran konsultasi terverifikasi.');
  }

  return { userId, profile, consultation };
}

async function listSignals(req, { consultationId, since }) {
  await requireCallableConsultation(req, consultationId);

  const filters = [
    `consultation_id=eq.${encodeURIComponent(consultationId)}`,
    'select=id,consultation_id,sender_id,sender_role,signal_type,payload,created_at',
    'order=created_at.asc'
  ];

  if (since) {
    filters.push(`created_at=gt.${encodeURIComponent(since)}`);
  }

  return await supabaseRest('GET', `call_signals?${filters.join('&')}`);
}

async function sendSignal(req, body) {
  const consultationId = String(body.consultationId || '').trim();
  const signalType = String(body.signalType || '').trim();
  const { userId, profile, consultation } = await requireCallableConsultation(req, consultationId);

  if (!consultationId) throw new Error('Consultation ID wajib tersedia.');
  if (!['ring', 'offer', 'answer', 'candidate', 'leave'].includes(signalType)) {
    throw new Error('Tipe sinyal call tidak valid.');
  }

  const senderRole = consultation.lawyer_id === userId
    ? 'lawyer'
    : consultation.client_id === userId
      ? 'client'
      : profile.role;

  const inserted = await supabaseRest('POST', 'call_signals', {
    consultation_id: consultationId,
    sender_id: userId,
    sender_role: senderRole,
    signal_type: signalType,
    payload: body.payload || {}
  });

  return inserted?.[0];
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      sendJson(res, 200, await listSignals(req, req.query || {}));
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      sendJson(res, 201, await sendSignal(req, body));
      return;
    }

    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Call belum siap.';
    sendJson(res, 502, {
      error: message
    });
  }
}
