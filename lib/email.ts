import nodemailer from 'nodemailer';

// Create transporter with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface InvitationEmailData {
  email: string;
  teamName: string;
  role: string;
  inviteId: string;
  signUpUrl: string;
}

export async function sendInvitationEmail(data: InvitationEmailData): Promise<void> {
  const { email, teamName, role, inviteId, signUpUrl } = data;

  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: `You're invited to join ${teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">You're invited to join ${teamName}!</h2>
        <p>Hello,</p>
        <p>You've been invited to join the team <strong>${teamName}</strong> as a <strong>${role}</strong>.</p>
        <p>Click the button below to accept your invitation and create your account:</p>
        <a href="${signUpUrl}?inviteId=${inviteId}"
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
          Accept Invitation
        </a>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${signUpUrl}?inviteId=${inviteId}</p>
        <p>This invitation will expire in 7 days.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `,
    text: `
      You're invited to join ${teamName}!

      Hello,

      You've been invited to join the team "${teamName}" as a "${role}".

      Click the following link to accept your invitation and create your account:
      ${signUpUrl}?inviteId=${inviteId}

      This invitation will expire in 7 days.

      Best regards,
      The Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
}
