/**
 * E2E Rusdi AI test — auth + chat API + Gemini connectivity.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LOG_PATH = path.join(__dirname, '../../debug-9ec02d.log');
const SESSION_ID = '9ec02d';
const API_PORT = process.env.API_PORT || 5000;

function log(hypothesisId, location, message, data = {}) {
  const entry = { sessionId: SESSION_ID, runId: 'rusdi-e2e', hypothesisId, location, message, data, timestamp: Date.now() };
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  console.log(`[${hypothesisId}] ${message}`, JSON.stringify(data));
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, serviceKey);

  // Find a client profile to test with
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('role', 'client')
    .limit(5);

  log('H7', 'test-rusdi-e2e.cjs', 'Client profiles found', { count: profiles?.length || 0, emails: (profiles || []).map((p) => p.email) });

  // Try to create a test session via admin API for rusdi
  const testEmail = `rusdi-audit-${Date.now()}@yda-test.local`;
  const testPassword = 'AuditTest123!';

  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Rusdi Audit User', role: 'client' }
  });

  if (createErr) {
    log('H7', 'test-rusdi-e2e.cjs', 'Create test user FAILED', { error: createErr.message });
    return;
  }

  const userId = created.user.id;
  await supabase.from('profiles').upsert({
    id: userId,
    full_name: 'Rusdi Audit User',
    email: testEmail,
    role: 'client',
    status: 'active'
  });

  const anon = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);
  const { data: login, error: loginErr } = await anon.auth.signInWithPassword({ email: testEmail, password: testPassword });

  if (loginErr || !login.session) {
    log('H7', 'test-rusdi-e2e.cjs', 'Login test user FAILED', { error: loginErr?.message });
    return;
  }

  const token = login.session.access_token;
  const sessionId = `e2e-${Date.now()}`;

  log('H7', 'test-rusdi-e2e.cjs', 'Test user authenticated', { userId, sessionId });

  const rusdiRes = await fetch(`http://localhost:${API_PORT}/api/rusdi/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      message: 'Apa itu perbuatan melawan hukum menurut hukum Indonesia?',
      sessionId,
      conversationId: sessionId,
      language: 'id'
    })
  });

  const rusdiBody = await rusdiRes.json().catch(() => ({}));
  log('H7', 'test-rusdi-e2e.cjs', 'Rusdi chat response', {
    status: rusdiRes.status,
    hasResponse: !!rusdiBody.response,
    responseLength: rusdiBody.response?.length || 0,
    error: rusdiBody.error || null,
    code: rusdiBody.code || null
  });

  // Check if message was persisted
  const { data: conv, error: convErr } = await supabase.from('ai_conversations').select('id').eq('id', sessionId).maybeSingle();
  const { data: msgs, error: msgErr } = await supabase.from('ai_messages').select('id, role').eq('conversation_id', sessionId);

  log('H2', 'test-rusdi-e2e.cjs', 'Persistence check', {
    conversationExists: !!conv,
    convError: convErr?.message || null,
    messageCount: msgs?.length || 0,
    msgError: msgErr?.message || null
  });

  // Cleanup test user
  await supabase.auth.admin.deleteUser(userId).catch(() => null);
  log('H7', 'test-rusdi-e2e.cjs', 'Test user cleaned up', { userId });
}

main().catch((err) => {
  log('FATAL', 'test-rusdi-e2e.cjs', 'E2E crashed', { error: err.message });
  process.exit(1);
});
