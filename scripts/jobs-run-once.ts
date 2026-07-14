const base = process.env['BRIDGE_URL'] ?? 'http://localhost:3001';
const response = await fetch(`${base}/v1/jobs/run-once`, { method: 'POST', headers: { authorization: 'Bearer local-development' } });
if (!response.ok) throw new Error(`Bridge returned ${response.status}`);
console.log(JSON.stringify(await response.json(), null, 2));
