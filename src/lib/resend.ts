export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Gestão dos Métodos <naoresponda@gestaodosmetodos.online>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
