import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Armazena tentativas de envio por IP
// NOTA: Em produção com múltiplas instâncias, use Redis ou similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuração: 5 emails por hora por IP
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora em milissegundos

export function proxy(request: NextRequest) {
  // Aplicar rate limiting apenas para /api/send
  if (request.nextUrl.pathname === '/api/send') {
    // Obter IP do cliente
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip =
      forwardedFor?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
      // Primeiro acesso ou janela de tempo expirou
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (userLimit.count >= RATE_LIMIT_MAX) {
      // Limite excedido
      const remainingTime = Math.ceil((userLimit.resetTime - now) / 1000 / 60); // minutos

      return NextResponse.json(
        {
          error: 'Muitas tentativas. Por favor, aguarde antes de enviar outro email.',
          retryAfter: remainingTime,
          message: `Você atingiu o limite de ${RATE_LIMIT_MAX} emails por hora. Tente novamente em ${remainingTime} minutos.`
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)), // segundos
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(userLimit.resetTime),
          }
        }
      );
    } else {
      // Incrementar contador
      userLimit.count++;

      // Adicionar headers informativos
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
      response.headers.set('X-RateLimit-Remaining', String(RATE_LIMIT_MAX - userLimit.count));
      response.headers.set('X-RateLimit-Reset', String(userLimit.resetTime));

      return response;
    }
  }

  return NextResponse.next();
}

// Configurar matcher para aplicar apenas a rotas específicas
export const config = {
  matcher: '/api/send',
};
