// AI Disclosure: Claude Sonnet v5.5 Medium used to include mailer .js file
//                AI handoff based on Claude repo evaluation, troubleshooting failed email send
// backend/utils/mailer.js
// Sends email through any SMTP server (Gmail, Mailgun, SendGrid relay, ...).
// If SMTP is not configured, falls back to console.log so local dev still works.
//
// SendGrid relay example (.env):
//   SMTP_HOST=smtp.sendgrid.net
//   SMTP_PORT=587
//   SMTP_USER=apikey
//   SMTP_PASS=<your SendGrid API key>
//   MAIL_FROM="KnightLink <no-reply@yourdomain.com>"

const nodemailer = require('nodemailer');

let transporter = null;

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465 (implicit TLS), false for 587/25 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

/*
 * @param {{to: string, subject: string, html?: string, text?: string}} message
 * @returns {Promise<{sent: boolean, devFallback?: boolean}>}
 * @throws if SMTP is configured and delivery fails (callers should try/catch)
 */
async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject) {
    throw new Error('sendEmail requires "to" and "subject"');
  }

  if (!smtpConfigured()) {
    console.log('[mailer] SMTP not configured, logging email instead of sending:');
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${text || html || ''}`);
    return { sent: false, devFallback: true };
  }

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  });
  return { sent: true };
}

module.exports = { sendEmail };