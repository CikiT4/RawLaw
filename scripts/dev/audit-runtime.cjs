/**
 * Autonomous runtime audit — DB tables, env vars, API health, Rusdi deps.
 * Writes NDJSON to debug-9ec02d.log for debug session analysis.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LOG_PATH = path.join(__dirname, '../../debug-9ec02d.log');
const SESSION_ID = '9ec02d';

function log(hypothesisId, location, message, data = {}) {
  const entry = {
    sessionId: SESSION_ID,
    runId: 'audit-pre-fix',
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now()
  };
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  console.log(`[${hypothesisId}] ${message}`, JSON.stringify(data));
}

async function checkTable(supabase, table) {
  const { data, count, error } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(1);
  return { table, exists: !error, count: error ? null : count, error: error?.message || null, code: error?.code || null };
}

async function checkRpc(supabase, fn, params) {
  const { data, error } = await supabase.rpc(fn, params);
  return { fn, ok: !error, resultCount: Array.isArray(data) ? data.length : data ? 1 : 0, error: error?.message || null };
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // H1: Missing env vars break Rusdi/API
  log('H1', 'audit-runtime.cjs:env', 'Environment validation', {
    hasSupabaseUrl: !!url,
    hasServiceKey: !!serviceKey,
    hasAnonKey: !!anonKey,
    hasGeminiKey: !!geminiKey && geminiKey !== 'MY_GEMINI_API_KEY',
    geminiPlaceholder: geminiKey === 'MY_GEMINI_API_KEY'
  });

  if (!url || !serviceKey) {
    log('H1', 'audit-runtime.cjs:env', 'FATAL: Supabase env missing', {});
    return;
  }

  const supabase = createClient(url, serviceKey);

  const tables = [
    'profiles', 'lawyer_directory', 'lawyer_profiles', 'app_consultations', 'app_payments',
    'consultations', 'ai_conversations', 'ai_messages', 'ai_chat_history', 'knowledge_base',
    'payment_method_configs', 'payment_verification_logs', 'notifications'
  ];

  const results = [];
  for (const table of tables) {
    const r = await checkTable(supabase, table);
    results.push(r);
    log('H2', 'audit-runtime.cjs:db', `Table check: ${table}`, r);
  }

  // H2: AI tables missing → Rusdi persistence fails
  const aiTables = results.filter((r) => r.table.startsWith('ai_'));
  log('H2', 'audit-runtime.cjs:db', 'AI tables summary', {
    ai_conversations: results.find((r) => r.table === 'ai_conversations'),
    ai_messages: results.find((r) => r.table === 'ai_messages'),
    ai_chat_history: results.find((r) => r.table === 'ai_chat_history')
  });

  // H3: search_knowledge RPC missing → RAG fails silently
  const rag = await checkRpc(supabase, 'search_knowledge', { search_query: 'hukum pidana', max_results: 3 });
  log('H3', 'audit-runtime.cjs:rag', 'search_knowledge RPC', rag);

  // H4: payment_method_configs missing → invoice generation fails
  const paymentConfigs = results.find((r) => r.table === 'payment_method_configs');
  log('H4', 'audit-runtime.cjs:payment', 'Payment configs', paymentConfigs || {});

  // H5: API health + Rusdi endpoint reachable
  const apiPort = process.env.API_PORT || 5000;
  try {
    const healthRes = await fetch(`http://localhost:${apiPort}/api/health`);
    const healthBody = await healthRes.json().catch(() => ({}));
    log('H5', 'audit-runtime.cjs:api', 'API health', { status: healthRes.status, body: healthBody });
  } catch (err) {
    log('H5', 'audit-runtime.cjs:api', 'API health FAILED', { error: err.message });
  }

  // Test Rusdi without auth (should 401/502)
  try {
    const rusdiRes = await fetch(`http://localhost:${apiPort}/api/rusdi/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', sessionId: 'audit-test', conversationId: 'audit-test' })
    });
    const rusdiBody = await rusdiRes.json().catch(() => ({}));
    log('H5', 'audit-runtime.cjs:rusdi', 'Rusdi unauthenticated', { status: rusdiRes.status, body: rusdiBody });
  } catch (err) {
    log('H5', 'audit-runtime.cjs:rusdi', 'Rusdi endpoint FAILED', { error: err.message });
  }

  // H6: Schema path detection (legacy vs v2)
  log('H6', 'audit-runtime.cjs:schema', 'Schema path', {
    hasUsersTable: results.find((r) => r.table === 'users')?.exists ?? false,
    hasLawyersTable: results.find((r) => r.table === 'lawyers')?.exists ?? false,
    hasLawyerDirectory: results.find((r) => r.table === 'lawyer_directory')?.exists ?? false,
    hasAppConsultations: results.find((r) => r.table === 'app_consultations')?.exists ?? false,
    hasTransactions: results.find((r) => r.table === 'transactions')?.exists ?? false,
    hasAppPayments: results.find((r) => r.table === 'app_payments')?.exists ?? false
  });

  console.log('\nAudit complete. Log written to debug-9ec02d.log');
}

main().catch((err) => {
  log('FATAL', 'audit-runtime.cjs', 'Audit crashed', { error: err.message });
  process.exit(1);
});
