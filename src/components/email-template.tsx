import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

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
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
      <Container style={{ backgroundColor: '#ffffff', padding: '20px', margin: '20px auto', maxWidth: '600px', borderRadius: '8px' }}>
        <Section>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Nova mensagem do portfólio
          </Text>
          <Hr style={{ borderColor: '#e0e0e0', margin: '20px 0' }} />
          <Text style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Nome:</strong> {name}
          </Text>
          <Text style={{ fontSize: '14px', marginBottom: '16px' }}>
            <strong>Email:</strong> {email}
          </Text>
          <Hr style={{ borderColor: '#e0e0e0', margin: '20px 0' }} />
          <Text style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {message}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
