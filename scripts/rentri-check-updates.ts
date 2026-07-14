import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

const known = process.env['RENTRI_KNOWN_CHANGELOG_VERSION'] ?? '1.1.1290';
const source = 'https://api.rentri.gov.it/';
const response = await fetch(source, { headers: { 'user-agent': 'rentridesk-update-check/0.1' } });
if (!response.ok) throw new Error(`RENTRI docs returned ${response.status}`);
const body = await response.text();
const detected = body.match(/ver\.\s*([0-9.]+)/i)?.[1] ?? 'unknown';
const report = { checkedAt: new Date().toISOString(), source, known, detected, changed: detected !== 'unknown' && detected !== known, sha256: createHash('sha256').update(body).digest('hex'), action: detected !== known ? 'Manual review required; no production change was applied.' : 'No action.' };
await mkdir('docs/rentri', { recursive: true });
await writeFile('docs/rentri/update-report.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
