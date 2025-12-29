import { Resend } from "resend";

console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("CONTACT API HIT");

    const body = await req.json();
    console.log("BODY:", body);

    const { name, email, message } = body;

    if (!name || !email || !message) {
      console.log("VALIDATION FAILED");
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: "INSEES Website <onboarding@resend.dev>",
      to: [
        
        "anmol.s.sahoo@gmail.com",
      ],
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("RESEND RESULT:", result);

    if (result.error) {
  console.error("RESEND FAILED:", result.error);
  return Response.json(
    { error: result.error.message },
    { status: 500 }
  );
}


    return Response.json({ success: true });
  } catch (err) {
    console.error("RESEND ERROR FULL:", err);
    return Response.json({ error: "Email failed" }, { status: 500 });
  }
}
