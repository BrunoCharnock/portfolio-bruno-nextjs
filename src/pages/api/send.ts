import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/email-template";
import { Resend } from "resend";
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);

// Limites de tamanho
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    let parsedBody;

    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body);
      } catch (parseError) {
        return res.status(400).json({ error: 'Formato JSON inválido' });
      }
    } else {
      parsedBody = req.body;
    }

    const { name, email, message } = parsedBody;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Nome é obrigatório." });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < MIN_NAME_LENGTH) {
      return res.status(400).json({
        error: `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres.`
      });
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        error: `Nome não pode exceder ${MAX_NAME_LENGTH} caracteres.`
      });
    }

    const sanitizedName = trimmedName.replace(/[\r\n\t\x00-\x1F\x7F]/g, '');

    if (sanitizedName.length === 0) {
      return res.status(400).json({ error: "Nome contém apenas caracteres inválidos." });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email é obrigatório." });
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return res.status(400).json({ error: "Email muito longo." });
    }

    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: "Email inválido." });
    }

    const normalizedEmail = validator.normalizeEmail(trimmedEmail) || trimmedEmail.toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Email inválido após normalização." });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Mensagem deve ter pelo menos ${MIN_MESSAGE_LENGTH} caracteres.`
      });
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Mensagem não pode exceder ${MAX_MESSAGE_LENGTH} caracteres.`
      });
    }

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL || "bruno.ccharnock@gmail.com",
      subject: `${sanitizedName} entrou em contato via Web Portfólio`,
      react: EmailTemplate({
        name: sanitizedName,
        message: trimmedMessage,
        email: normalizedEmail
      }),
    });

    if (response && response.data && response.data.id) {
      return res.status(200).json({
        message: "Email enviado com sucesso!",
        id: response.data.id
      });
    } else if (response && response.error) {
      console.error('[API /send] Erro Resend:', response.error);
      return res.status(500).json({
        error: "Erro ao enviar email. Tente novamente mais tarde."
      });
    } else {
      console.error('[API /send] Resend retornou resposta inesperada:', response);
      return res.status(500).json({
        error: "Erro ao enviar email. Tente novamente mais tarde."
      });
    }

  } catch (error) {
    console.error('[API /send] Erro ao processar requisição:', error);
    return res.status(500).json({
      error: "Erro interno do servidor. Tente novamente mais tarde."
    });
  }
}
