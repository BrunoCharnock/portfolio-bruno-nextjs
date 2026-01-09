import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import { EmailTemplateProps } from "@/components/email-template";
import styles from "@/styles/contact.module.css";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

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

      setIsSubmitting(true);

      const res = await fetch("https://www.brunocharnock.com.br/api/send", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        reset();
        toast.success("Email enviado com sucesso!");
      } else {
        toast.error("Não foi possível enviar o email.");
        console.log(res);
      }
    } catch (err) {
      toast.error("Não foi possível enviar o email.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className={styles.contactSection} ref={ref}>
      <div className={styles.container}>
        {/* Heading */}
        <div className={`${styles.headingWrapper} ${inView ? styles.fadeIn : ''}`}>
          <h2 className={styles.heading}>Entre em Contato</h2>
          <div className={styles.headingLine}></div>
          <p className={styles.subheading}>
            Tem algum projeto em mente ou quer apenas conversar? Minha caixa de entrada está sempre aberta!
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Side - Info */}
          <div className={`${styles.infoContainer} ${inView ? styles.slideInLeft : ''}`}>
            <h3 className={styles.infoHeading}>Vamos trabalhar juntos?</h3>
            <p className={styles.infoText}>
              Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades 
              para fazer parte da sua visão. Preencha o formulário ao lado e entrarei em contato 
              o mais breve possível.
            </p>

            {/* Contact Info Cards */}
            <div className={styles.contactInfoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>bruno.ccharnock@gmail.com</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>GitHub</div>
                  <div className={styles.infoValue}>@BrunoCharnock</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={`${styles.formContainer} ${inView ? styles.slideInRight : ''}`}>
            <form
              onSubmit={handleSubmit((formData) => {
                sendEmail(formData as EmailTemplateProps);
              })}
              className={styles.form}
            >
              {/* Name Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Seu nome
                  <span className={styles.required}>*</span>
                </label>
                <input
                  {...register("name", { required: true, minLength: 3 })}
                  className={styles.input}
                  placeholder="João Silva"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Seu email
                  <span className={styles.required}>*</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className={styles.input}
                  placeholder="joao@exemplo.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Message Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mensagem
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  {...register("message", { required: true, minLength: 10 })}
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Conte-me sobre seu projeto ou ideia..."
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}