import nodemailer from 'nodemailer';
import { env } from '../../env/server.mjs';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport(new SMTPTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT as any,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
})
);

const sendEmail = async (to: string, subject: string, text: string): Promise<any> => {
  console.log(env.SMTP_USERNAME, env.SMTP_PASSWORD);

  const msg = { from: env.EMAIL_FROM, to, subject, text };
  await transport.sendMail(msg);
};

const sendInviteEmail = async (to: string, token: string): Promise<any> => {
  const subject = 'Invitation to join a workspace';
  // replace this url with the link to the invitation page of your front-end app
  const invitationUrl = `http://localhost:3000/invite?token=${token}`;
  const text = `Dear user,
  You have been invited to join a workspace. To accept the invitation, click on this link: ${invitationUrl}
  If you did not request any invitations, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendResetPasswordEmail = async (to: string, token: string): Promise<any> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to: string, token: string): Promise<any> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export const emailService = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendInviteEmail,
};