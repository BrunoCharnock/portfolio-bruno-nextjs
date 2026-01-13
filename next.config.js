/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Aplicar headers a todas as rotas
        source: '/:path*',
        headers: [
          // Content Security Policy - Previne XSS e data injection
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",  // Apenas recursos do próprio domínio por padrão
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Scripts (Next.js precisa de unsafe-eval)
              "style-src 'self' 'unsafe-inline'",  // Estilos inline (Tailwind CSS precisa)
              "img-src 'self' data: https:",  // Imagens do próprio site, data URIs, e HTTPS externo
              "font-src 'self' data:",  // Fontes do próprio site e data URIs
              "connect-src 'self' https://api.github.com",  // APIs permitidas
              "frame-ancestors 'none'",  // Não permitir iframe
              "base-uri 'self'",  // Prevenir sequestro de base tag
              "form-action 'self'",  // Formulários só podem enviar para próprio domínio
            ].join('; '),
          },

          // X-Frame-Options - Previne Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',  // Não permite que o site seja colocado em iframe
          },

          // X-Content-Type-Options - Previne MIME Sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',  // Browser não deve "adivinhar" content-type
          },

          // Referrer-Policy - Controla informações de referer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',  // Envia origem completa apenas para mesma origem
          },

          // Permissions-Policy - Controla features do browser
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',  // Bloqueia acesso à câmera
              'microphone=()',  // Bloqueia acesso ao microfone
              'geolocation=()',  // Bloqueia acesso à localização
              'interest-cohort=()',  // Bloqueia FLoC (privacy)
            ].join(', '),
          },

          // X-DNS-Prefetch-Control - Controla DNS prefetching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },

      // Headers específicos para API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',  // Não cachear respostas de API
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
