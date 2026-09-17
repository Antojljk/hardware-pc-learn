import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'antoine.drutel@gmail.com',
      subject: `[HardwarePC Contact] ${subject}`,
      html: `<p><strong>De :</strong> ${name} (${email})</p><p><strong>Message :</strong> ${message}</p>`
    });

    return NextResponse.json({ message: 'Sent' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
