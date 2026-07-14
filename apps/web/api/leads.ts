import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { sendLeadNotificationEmail } from '../lib/lead-mail.js';

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  businessType: z.string().trim().min(2).max(80),
  currentProcess: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  source: z.string().trim().max(80).default('landing-page'),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  privacyAccepted: z.literal(true),
  privacyVersion: z.string().trim().min(1).max(30),
  website: z.string().max(200).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'Metodo non consentito' });
  }

  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ code: 'INVALID_LEAD', message: 'Controlla i dati inseriti e riprova' });
  }

  if (parsed.data.website) {
    return res.status(202).json({ accepted: true });
  }

  const password = process.env.GMAIL_PASSWORD;
  if (!password) {
    return res.status(503).json({
      code: 'LEAD_NOTIFICATION_UNAVAILABLE',
      message: 'Raccolta contatti temporaneamente non disponibile',
    });
  }

  const lead = parsed.data;

  try {
    const emailPayload = {
      name: lead.name,
      email: lead.email.toLowerCase(),
      businessType: lead.businessType,
      source: lead.source,
      privacyVersion: lead.privacyVersion,
      ...(lead.phone ? { phone: lead.phone } : {}),
      ...(lead.currentProcess ? { currentProcess: lead.currentProcess } : {}),
      ...(lead.message ? { message: lead.message } : {}),
      ...(lead.utmSource ? { utmSource: lead.utmSource } : {}),
      ...(lead.utmMedium ? { utmMedium: lead.utmMedium } : {}),
      ...(lead.utmCampaign ? { utmCampaign: lead.utmCampaign } : {}),
    };
    await sendLeadNotificationEmail(emailPayload, password);
  } catch {
    return res.status(500).json({
      code: 'LEAD_EMAIL_FAILED',
      message: 'Invio non riuscito, riprova tra poco',
    });
  }

  return res.status(201).json({ accepted: true });
}
