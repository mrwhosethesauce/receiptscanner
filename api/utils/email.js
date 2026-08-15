const { Resend } = require('resend');

let client;
function getClient() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

async function sendPasswordResetEmail(to, resetUrl) {
  const resend = getClient();
  const { error } = await resend.emails.send({
    from: 'Receipt Scanner <onboarding@resend.dev>',
    to,
    subject: 'Reset your password',
    html: `
      <p>Someone requested a password reset for your Receipt Scanner account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
    `,
  });
  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }
}

module.exports = { sendPasswordResetEmail };
