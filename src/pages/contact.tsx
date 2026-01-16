import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/hooks/useTranslation";
import { EmailTemplateProps } from "@/components/email-template";
import styles from "@/styles/contact.module.css";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const { t } = useTranslation();

  const sendEmail = async (formData: EmailTemplateProps) => {
    try {
      if (formData.message.trim().length < 10) {
        toast.warning(t('validation.messageMin'));
        return;
      }

      if (formData.name.trim().length < 3) {
        toast.warning(t('validation.nameMin'));
        return;
      }

      if (!formData.email || !formData.email.includes('@')) {
        toast.warning(t('validation.emailInvalid'));
        return;
      }

      setIsSubmitting(true);

      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        reset();
        toast.success(data.message || t('validation.emailSuccess'));
      } else if (res.status === 429) {
        const retryAfter = data.retryAfter || '?';
        toast.error(`${t('validation.rateLimitError')} ${retryAfter} ${t('validation.minutes')}.`);
      } else if (res.status === 400) {
        toast.error(data.error || t('validation.invalidData'));
      } else {
        toast.error(data.error || t('validation.emailError'));
      }
    } catch (err) {
      toast.error(t('validation.connectionError'));
      console.error('Error sending email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className={styles.contactSection} ref={ref}>
      <div className={styles.container}>
        {/* Heading */}
        <div className={`${styles.headingWrapper} ${inView ? styles.fadeIn : ''}`}>
          <h2 className={styles.heading}>{t('contact.title')}</h2>
          <div className={styles.headingLine}></div>
          <p className={styles.subheading}>
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Side - Info */}
          <div className={`${styles.infoContainer} ${inView ? styles.slideInLeft : ''}`}>
            <h3 className={styles.infoHeading}>{t('contact.workTogether')}</h3>
            <p className={styles.infoText}>
              {t('contact.infoText')}
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
                  {t('contact.labelName')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  {...register("name", { required: true, minLength: 3 })}
                  className={styles.input}
                  placeholder={t('contact.placeholderName')}
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t('contact.labelEmail')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className={styles.input}
                  placeholder={t('contact.placeholderEmail')}
                  disabled={isSubmitting}
                />
              </div>

              {/* Message Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t('contact.labelMessage')}
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  {...register("message", { required: true, minLength: 10 })}
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder={t('contact.placeholderMessage')}
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
                    {t('contact.submitting')}
                  </>
                ) : (
                  <>
                    {t('contact.submit')}
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
