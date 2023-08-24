import type { NextApiRequest, NextApiResponse } from "next";
import {
  EmailTemplate,
  EmailTemplateProps,
} from "../../components/email-template";
import { Resend } from "resend";
import {
  CreateEmailOptions,
  CreateEmailRequestOptions,
} from "resend/build/src/emails/interfaces";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, message } = JSON.parse(req.body);
    console.log(email);
    console.log(EmailTemplate);
    if (!message || typeof message !== "string") {
      return res.status(500).end("Mensagem inválida.");
    }

    if (!name || typeof name !== "string") {
      return res.status(500).end("Nome inválido.");
    }

    if (!email || typeof email !== "string") {
      return res.status(500).end("Email inválido.");
    }

    resend.emails
      .send({
        from: "delivered@resend.dev",
        to: "bruno.ccharnock@gmail.com",
        subject: name + " entrou em contato via Web Portfólio",
        react: EmailTemplate({ name: name, message: message, email: email }),
        reply_to: [email],
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      } as CreateEmailOptions)
      .then(function (response) {
        console.log(response);
        res.status(200).end("Email enviado com sucesso!");
      })
      .catch(function (err) {
        res.status(200).end("Erro:" + err);
      });
  } catch (error) {
    res.status(200).end("Erro:");
  }
}
