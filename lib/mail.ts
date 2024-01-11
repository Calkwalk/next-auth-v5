import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email (Auth)",
    html: `
    <p>Dear:</P>
    <p>This email from Auth-tutorial to confirm your login identity.</p>
    <br/>
    <p>
        Click<a href="${confirmLink}">here</a>
        <br />
        Or driect access: ${confirmLink}.
    </p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset password (Auth)",
    html: `
    <p>Dear:</P>
    <p>This email from Auth-tutorial to reset you password.</p>
    <br/>
    <p>
        Click<a href="${resetLink}">here</a>
        <br />
        Or driect access: ${resetLink}.
    </p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two Factor Token (Auth)",
    html: `
    <p>Dear:</P>
    <p>This email from Auth-tutorial to 2FA Code.</p>
    <br/>
    <p>
        The 2FA Code: ${token}.
    </p>`,
  });
};

