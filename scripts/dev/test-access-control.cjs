/**
 * Validates RBAC rules for client workflow without browser.
 */
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../../debug-9ec02d.log');
const SESSION_ID = '9ec02d';

function log(hypothesisId, message, data) {
  const entry = { sessionId: SESSION_ID, runId: 'access-control', hypothesisId, location: 'test-access-control.cjs', message, data, timestamp: Date.now() };
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  console.log(`[${hypothesisId}] ${message}`, JSON.stringify(data));
}

// Mirror accessControl.ts logic (simplified)
const FREE = ['rusdi-ai','case-analysis','lawyer-recommendation','lawyer-search','lawyer-profiles','consultation-booking','public-legal-info','help','profile-settings','case-history'];
const PAID = ['lawyer-chat','meeting-room','consultation-documents','consultation-review'];
const VIEW_MAP = { 'rusdi-chat':'rusdi-ai', chat:'lawyer-chat', meeting:'meeting-room', 'document-vault':'consultation-documents' };

function canAccessConsultationSession(row) {
  return (row.app_payments || []).some((p) => p.status === 'paid');
}

function canAccessFeature(feature, user, consultation, consultations) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'lawyer') return feature !== 'consultation-booking';
  if (FREE.includes(feature)) return true;
  if (PAID.includes(feature)) {
    if (feature === 'consultation-documents') return consultations.some(canAccessConsultationSession);
    if (consultation) return canAccessConsultationSession(consultation);
    return false;
  }
  return false;
}

const client = { role: 'client', id: 'test' };
const unpaidConsultation = { id: 'c1', app_payments: [{ status: 'pending' }] };
const paidConsultation = { id: 'c2', app_payments: [{ status: 'paid' }] };

const tests = [
  { view: 'rusdi-chat', feature: 'rusdi-ai', consultation: null, expected: true, desc: 'Client Rusdi free without payment' },
  { view: 'lawyer-list', feature: 'lawyer-search', consultation: null, expected: true, desc: 'Client lawyer search free' },
  { view: 'chat', feature: 'lawyer-chat', consultation: unpaidConsultation, expected: false, desc: 'Client chat blocked unpaid' },
  { view: 'chat', feature: 'lawyer-chat', consultation: paidConsultation, expected: true, desc: 'Client chat allowed paid' },
  { view: 'meeting', feature: 'meeting-room', consultation: unpaidConsultation, expected: false, desc: 'Meeting blocked unpaid' },
  { view: 'document-vault', feature: 'consultation-documents', consultation: null, consultations: [], expected: false, desc: 'Vault blocked no paid' },
  { view: 'document-vault', feature: 'consultation-documents', consultation: null, consultations: [paidConsultation], expected: true, desc: 'Vault allowed with paid' },
];

let pass = 0;
for (const t of tests) {
  const feature = VIEW_MAP[t.view] || t.feature;
  const result = canAccessFeature(feature, client, t.consultation, t.consultations || []);
  const ok = result === t.expected;
  if (ok) pass += 1;
  log('H8', t.desc, { view: t.view, feature, expected: t.expected, actual: result, ok });
}

log('H8', 'RBAC test summary', { total: tests.length, passed: pass, failed: tests.length - pass });
