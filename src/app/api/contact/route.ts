import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "your_key_here") {
      // Dev mode: just log it
      console.log("Contact form submission:", { name, email, message });
      return NextResponse.json({ success: true, dev: true });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "mithilesh.28csb@licet.ac.in",
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
