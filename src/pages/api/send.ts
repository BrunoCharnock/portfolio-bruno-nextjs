import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../components/email-template";
import { Resend } from "resend";
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);

// Limites de tamanho para prevenir abuso
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Validar método HTTP - apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // 2. Parse do body com tratamento de erro
    // Next.js já faz parse automático do JSON quando Content-Type é application/json
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

    // 3. Validação do nome
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

    // Sanitização: remover caracteres de controle para prevenir email injection
    const sanitizedName = trimmedName.replace(/[\r\n\t\x00-\x1F\x7F]/g, '');

    if (sanitizedName.length === 0) {
      return res.status(400).json({ error: "Nome contém apenas caracteres inválidos." });
    }

    // 4. Validação do email
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email é obrigatório." });
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return res.status(400).json({ error: "Email muito longo." });
    }

    // Validação de formato de email usando validator.js (RFC 5322)
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ error: "Email inválido." });
    }

    // Normalizar email (converte para lowercase e remove pontos em gmail)
    const normalizedEmail = validator.normalizeEmail(trimmedEmail) || trimmedEmail.toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Email inválido após normalização." });
    }

    // 5. Validação da mensagem
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

    // 6. Enviar email com dados validados e sanitizados
    const response = await resend.emails.send({
      from: "delivered@resend.dev",
      to: process.env.CONTACT_EMAIL || "bruno.ccharnock@gmail.com",
      subject: `${sanitizedName} entrou em contato via Web Portfólio`,
      react: EmailTemplate({
        name: sanitizedName,
        message: trimmedMessage,
        email: normalizedEmail
      }),
      replyTo: [normalizedEmail], // Nova versão do SDK usa camelCase
    });

    // 7. Verificar resposta
    // Nova versão do Resend SDK (6.7.0) retorna: { data: { id }, error }
    if (response && response.data && response.data.id) {
      return res.status(200).json({
        message: "Email enviado com sucesso!",
        id: response.data.id
      });
    } else if (response && response.error) {
      // Erro retornado pela API Resend
      console.error('[API /send] Erro Resend:', response.error);
      return res.status(500).json({
        error: "Erro ao enviar email. Tente novamente mais tarde."
      });
    } else {
      // Resposta inesperada
      console.error('[API /send] Resend retornou resposta inesperada:', response);
      return res.status(500).json({
        error: "Erro ao enviar email. Tente novamente mais tarde."
      });
    }

  } catch (error) {
    // Log detalhado apenas server-side
    console.error('[API /send] Erro ao processar requisição:', error);

    // Mensagem genérica para o cliente (não expor detalhes internos)
    return res.status(500).json({
      error: "Erro interno do servidor. Tente novamente mais tarde."
    });
  }
}
