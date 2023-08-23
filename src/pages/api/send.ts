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

const resend = new Resend("re_Asxqt8nY_HmPf9ZbB46bvQrUN3MXGu8o7");

export const sendEmail = async (formData: EmailTemplateProps) => {
  try {
    const { name, email, message } = formData;

    if (!message || typeof message !== "string") {
      return {
        erro: "Mensagem inválida.",
      };
    }

    if (!email || typeof email !== "string") {
      return {
        erro: "Email inválido.",
      };
    }
    debugger;
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: " bruno.ccharnock@gmail.com",
      subject: name + " entrou em contato via Web Portfólio",
      react: EmailTemplate({ name: name, message: message, email: email }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    } as CreateEmailOptions);
    console.log("passou");
  } catch (error) {}
};
