import { data } from "autoprefixer";
import { Inter } from "next/font/google";
import { useState } from "react";
import { EmailTemplateProps } from "@/components/email-template";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();

  const sendEmail = async (formData: EmailTemplateProps) => {
    try {
      if (formData.message.length < 10) {
        toast.warning("Sua mensagem precisa ter pelo menos 10 caracteres.");
        return;
      }

      if (formData.name.length < 3) {
        toast.warning("O nome precisa ter mais de 2 letras");
        return;
      }

      /*const res = await fetch("https://www.brunocharnock.com.br/api/send", { */
      const res = await fetch("https://www.brunocharnock.com.br/api/send", {
        method: "POST",
        body: JSON.stringify(formData),
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            reset();
            toast.success("Email enviado com sucesso!");
          } else {
            toast.error("Não foi possível enviar o email.");
            console.log(res);
          }
        })
        .catch((e) => {
          toast.error("Não foi possível enviar o email.");
          console.log(e);
        });
    } catch (err) {
      toast.error("Não foi possível enviar o email.");
      console.log(err);
      return;
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
