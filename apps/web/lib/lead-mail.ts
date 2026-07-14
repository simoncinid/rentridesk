import nodemailer from 'nodemailer';

export const GMAIL_SMTP_USER = 'reservationwebbitz@gmail.com';
export const LEAD_NOTIFY_TO = 'simoncinidiego10@gmail.com';

export type LeadEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  businessType: string;
  currentProcess?: string;
  message?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyVersion: string;
  leadId?: string;
};

function formatLeadBody(lead: LeadEmailPayload): { text: string; html: string } {
  const rows: Array<[string, string]> = [
    ['Nome', lead.name],
    ['Email', lead.email],
    ['Telefono', lead.phone || '—'],
    ['Attività', lead.businessType],
    ['Processo attuale', lead.currentProcess || '—'],
    ['Messaggio', lead.message || '—'],
    ['Fonte', lead.source],
    ['UTM source', lead.utmSource || '—'],
    ['UTM medium', lead.utmMedium || '—'],
    ['UTM campaign', lead.utmCampaign || '—'],
    ['Privacy version', lead.privacyVersion],
    ['ID lead', lead.leadId || '—'],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.5">${rows
    .map(([label, value]) => `<strong>${label}</strong>: ${escapeHtml(value)}`)
    .join('\n')}</pre>`;

  return { text, html };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function sendLeadNotificationEmail(
  lead: LeadEmailPayload,
  password: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: GMAIL_SMTP_USER,
      pass: password,
    },
  });

  const body = formatLeadBody(lead);

  await transporter.sendMail({
    from: `"rentridesk lead" <${GMAIL_SMTP_USER}>`,
    to: LEAD_NOTIFY_TO,
    replyTo: lead.email,
    subject: `Nuovo lead rentridesk — ${lead.name}`,
    text: body.text,
    html: body.html,
  });
}
