import { describe, expect, it } from 'vitest';
import { GMAIL_SMTP_USER, LEAD_NOTIFY_TO } from './lead-mail.js';

describe('lead-mail constants', () => {
  it('usa il mittente e il destinatario Gmail richiesti', () => {
    expect(GMAIL_SMTP_USER).toBe('reservationwebbitz@gmail.com');
    expect(LEAD_NOTIFY_TO).toBe('simoncinidiego10@gmail.com');
  });
});
