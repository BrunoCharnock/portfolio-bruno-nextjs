import { data } from "autoprefixer";
import { Inter } from "next/font/google";
import { useState } from "react";
import { sendEmail } from "../pages/api/send";
import { EmailTemplateProps } from "@/components/email-template";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const [emailInfo, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  } as EmailTemplateProps);

  function handleSubmit() {
    sendEmail(emailInfo);
  }

  return (
    <div className="w-full max-w-xs">
      <h2 className="text-black text-xl">
        Você pode usar este formulário para entrar em contato comigo
      </h2>

      <form
        onSubmit={() => handleSubmit()}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Seu nome
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={emailInfo.name}
            required
            onChange={(e) =>
              setFormData({ ...emailInfo, name: e.target.value })
            }
          ></input>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Seu email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            required
            value={emailInfo.email}
            onChange={(e) =>
              setFormData({ ...emailInfo, email: e.target.value })
            }
          ></input>
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Mensagem
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            type="text"
            required
            value={emailInfo.message}
            onChange={(e) =>
              setFormData({ ...emailInfo, message: e.target.value })
            }
            placeholder="Digite sua mensagem"
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
