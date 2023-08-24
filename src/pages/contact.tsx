import { data } from "autoprefixer";
import { Inter } from "next/font/google";
import { useState } from "react";
import { EmailTemplateProps } from "@/components/email-template";
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const { register, handleSubmit } = useForm();

  const sendEmail = async (formData: EmailTemplateProps) => {
    try {
      const res = await fetch("../api/send", {
        method: "POST",
        body: JSON.stringify(formData),
      }).catch((e) => console.log(e));

      const data = await res;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <h2 className="text-black text-xl">
        Você pode usar este formulário para entrar em contato comigo
      </h2>

      <form
        onSubmit={handleSubmit((formData) => {
          sendEmail(formData as EmailTemplateProps);
        })}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seu nome
          </label>
          <input
            {...register("name")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></input>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seu email
          </label>
          <input
            {...register("email")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></input>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mensagem
          </label>
          <input
            {...register("message")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
