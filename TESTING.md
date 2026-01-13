# 🧪 Guia de Testes - Portfolio Bruno Charnock

Este documento descreve a suíte de testes implementada no projeto.

## 📋 Índice

- [Estrutura de Testes](#estrutura-de-testes)
- [Executando os Testes](#executando-os-testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Testes Implementados](#testes-implementados)
- [Boas Práticas](#boas-práticas)

---

## Estrutura de Testes

```
src/
├── pages/
│   ├── api/
│   │   ├── __tests__/
│   │   │   └── send.test.ts          # Testes da API de envio de email
│   │   └── send.ts
│   ├── __tests__/
│   │   ├── contact.test.tsx          # Testes do formulário de contato
│   │   └── projects.test.tsx         # Testes da página de projetos
│   ├── contact.tsx
│   └── projects.tsx
├── jest.config.js                     # Configuração do Jest
└── jest.setup.js                      # Setup global dos testes
```

---

## Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (reexecuta ao modificar arquivos)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes em modo CI (para GitHub Actions, etc)
npm run test:ci
```

### Exemplos de Uso

```bash
# Desenvolvimento: executar testes e assistir mudanças
npm run test:watch

# Antes de commit: verificar cobertura
npm run test:coverage

# CI/CD: testes otimizados para pipeline
npm run test:ci
```

---

## Cobertura de Testes

### Meta de Cobertura

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Visualizar Cobertura

Após executar `npm run test:coverage`, abra o relatório em:

```
coverage/lcov-report/index.html
```

---

## Testes Implementados

### 1. API `/api/send` (src/pages/api/__tests__/send.test.ts)

#### ✅ Validação de Método HTTP
- Rejeita requisições não-POST
- Aceita requisições POST válidas

#### ✅ Validação de Nome
- Rejeita nome ausente
- Rejeita nome muito curto (< 2 caracteres)
- Rejeita nome muito longo (> 100 caracteres)
- Sanitiza caracteres de controle (\r, \n, \t)

#### ✅ Validação de Email
- Rejeita email ausente
- Rejeita formato de email inválido
- Aceita email válido (RFC 5322)
- Normaliza email para lowercase

#### ✅ Validação de Mensagem
- Rejeita mensagem ausente
- Rejeita mensagem muito curta (< 10 caracteres)
- Rejeita mensagem muito longa (> 5000 caracteres)

#### ✅ Envio de Email
- Envia email com sucesso com dados válidos
- Remove whitespace de todos os campos

#### ✅ Segurança
- Previne injeção de email via campo nome
- Trata JSON malformado graciosamente

**Total: 19 testes**

---

### 2. Formulário de Contato (src/pages/__tests__/contact.test.tsx)

#### ✅ Renderização
- Renderiza formulário corretamente

#### ✅ Validação Client-Side
- Mostra warning para nome curto
- Mostra warning para mensagem curta
- Mostra warning para email inválido

#### ✅ Submissão de Formulário
- Submete formulário válido com sucesso
- Trata erro de rate limit (429)
- Trata erro de validação (400)
- Trata erro de rede

#### ✅ Estado do Formulário
- Desabilita botão durante submissão

**Total: 9 testes**

---

### 3. Página de Projetos (src/pages/__tests__/projects.test.tsx)

#### ✅ Renderização
- Mostra estado de carregamento inicialmente

#### ✅ Busca e Validação de Dados
- Busca e exibe repositórios válidos do GitHub
- Sanitiza conteúdo malicioso (XSS)
- Filtra repositórios inválidos
- Valida URLs (apenas GitHub)
- Trata descrições nulas

#### ✅ Tratamento de Erros
- Exibe mensagem de erro quando API falha
- Exibe mensagem de erro quando rede falha
- Exibe erro quando API retorna não-array
- Exibe erro quando todos repos são inválidos
- Permite retry após erro

#### ✅ Features de Display
- Exibe estatísticas de repositório
- Não exibe stats quando valores são zero
- Exibe link do GitHub quando projetos carregam

**Total: 13 testes**

---

## Boas Práticas

### 1. Organização

✅ **Agrupe testes relacionados com `describe()`**
```typescript
describe('Input Validation - Email', () => {
  it('should reject missing email', ...);
  it('should reject invalid email format', ...);
  it('should accept valid email', ...);
});
```

### 2. Nomenclatura

✅ **Use descrições claras e específicas**
```typescript
// ✅ Bom
it('should reject name that is too short', ...);

// ❌ Ruim
it('tests name validation', ...);
```

### 3. Isolamento

✅ **Limpe mocks entre testes**
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 4. Dados de Teste

✅ **Use dados realistas**
```typescript
const mockRepo = {
  id: 1,
  name: 'Test Repo',
  html_url: 'https://github.com/user/repo',
  description: 'A test repository',
  // ... campos completos
};
```

### 5. Testes de Segurança

✅ **Sempre teste inputs maliciosos**
```typescript
it('should sanitize XSS attempts', async () => {
  const maliciousInput = '<script>alert("XSS")</script>';
  // ... teste de sanitização
});
```

### 6. Asserts Específicos

✅ **Use matchers precisos**
```typescript
// ✅ Bom
expect(response.status).toBe(400);
expect(data.error).toContain('Email inválido');

// ❌ Ruim
expect(response.status).toBeTruthy();
```

---

## Adicionando Novos Testes

### 1. Para Componentes React

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. Para API Routes

```typescript
// src/pages/api/__tests__/myroute.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../myroute';

describe('/api/myroute', () => {
  it('should handle POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { data: 'test' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
```

### 3. Para Funções Utilitárias

```typescript
// src/utils/__tests__/myutil.test.ts
import { myFunction } from '../myutil';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

---

## CI/CD Integration

### GitHub Actions

Crie `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Problema: Testes falhando com "Cannot find module"

**Solução:** Verifique os path aliases no `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Problema: Testes timeout

**Solução:** Aumente o timeout para testes assíncronos:
```typescript
it('should complete async operation', async () => {
  // ... teste
}, 10000); // 10 segundos
```

### Problema: Mocks não funcionam

**Solução:** Limpe mocks entre testes:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Next.js](https://nextjs.org/docs/testing)
- [Jest Matchers](https://jestjs.io/docs/expect)

---

**Última atualização:** 13 de Janeiro de 2026
