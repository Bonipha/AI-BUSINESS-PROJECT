import nodemailer from 'nodemailer';

const smtpPort = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendSignupEmail({ to, name = '' }) {
  if (!to) {
    throw new Error('Recipient email is required');
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_USER and SMTP_PASSWORD must be configured');
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const displayName = name ? ` ${name}` : '';

  return transporter.sendMail({
    from,
    to,
    subject: 'Welcome to AI Project',
    text: `Hello${displayName},\n\nYour account has been created successfully.`,
    html: `<p>Hello${displayName},</p><p>Your account has been created successfully.</p>`,
  });
}

async function verifyEmailTransporter() {
  return transporter.verify();
}

export {
  sendSignupEmail,
  verifyEmailTransporter,
};
