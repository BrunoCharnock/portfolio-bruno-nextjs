import * as React from "react";

export interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  message,
  email,
}) => (
  <div>
    <b>Email: {email} </b>
    <b>Nome: {name}</b>
    <hr />
    <p>{message}</p>
  </div>
);
