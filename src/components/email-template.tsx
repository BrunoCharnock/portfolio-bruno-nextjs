import * as React from "react";

export interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  message,
}) => (
  <div>
    <h1>Olá Bruno, me chamo {name}!</h1>
    <h1>{message}</h1>
  </div>
);
