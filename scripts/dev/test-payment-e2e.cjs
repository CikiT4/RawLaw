const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LOG_PATH = path.join(__dirname, '../../debug-9ec02d.log');
const API_PORT = process.env.API_PORT || 5000;

function log(hypothesisId, message, data) {
  fs.appendFileSync(LOG_PATH, JSON.stringify({ sessionId: '9ec02d', runId: 'payment-e2e', hypothesisId, location: 'test-payment-e2e.cjs', message, data, timestamp: Date.now() }) + '\n');
  console.log(`[${hypothesisId}] ${message}`, JSON.stringify(data));
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, serviceKey);

  const { data: consultation } = await supabase
    .from('app_consultations')
    .select('id, client_id, price, status')
    .eq('status', 'pending')
    .limit(1)
    .maybeSingle();

  if (!consultation) {
    log('H4', 'No pending consultation for payment test', {});
    return;
  }

  const testEmail = `pay-audit-${Date.now()}@yda-test.local`;
  const { data: created } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'AuditTest123!',
    email_confirm: true
  });

  await supabase.from('profiles').upsert({
    id: created.user.id,
    full_name: 'Pay Audit',
    email: testEmail,
    role: 'client',
    status: 'active'
  });

  const anon = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);
  const { data: login } = await anon.auth.signInWithPassword({ email: testEmail, password: 'AuditTest123!' });
  const token = login.session.access_token;

  const methodsRes = await fetch(`http://localhost:${API_PORT}/api/payments`, { method: 'GET' });
  const methods = await methodsRes.json().catch(() => []);
  log('H4', 'Payment methods GET', { status: methodsRes.status, count: Array.isArray(methods) ? methods.length : 0 });

  const invoiceRes = await fetch(`http://localhost:${API_PORT}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      action: 'create-invoice',
      consultationId: consultation.id,
      method: 'bank_transfer',
      subMethod: 'bca'
    })
  });
  const invoiceBody = await invoiceRes.json().catch(() => ({}));
  log('H4', 'Invoice creation', { status: invoiceRes.status, hasInvoice: !!invoiceBody.invoiceNumber, error: invoiceBody.error || null });

  await supabase.auth.admin.deleteUser(created.user.id).catch(() => null);
}

main().catch((e) => log('FATAL', 'Payment E2E crashed', { error: e.message }));
