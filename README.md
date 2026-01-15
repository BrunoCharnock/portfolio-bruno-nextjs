# 🎨 Portfolio Bruno - Next.js

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features a contact form with email integration, dynamic GitHub projects showcase, and robust security measures.

## ✨ Features

- **Responsive Design** - Fully responsive layout that works on all devices
- **Dynamic Projects** - Automatically fetches and displays GitHub repositories
- **Contact Form** - Integrated email functionality using Resend API
- **Type Safety** - Built with TypeScript for better code quality
- **Security First** - Comprehensive security headers and input validation
- **Tested** - Jest and React Testing Library for component testing
- **Animations** - Smooth scroll animations using Intersection Observer

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with SSR and SSG
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **Email**: [Resend](https://resend.com/) - Transactional email API
- **Forms**: [React Hook Form](https://react-hook-form.com/) - Form validation
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Validation**: [Validator.js](https://github.com/validatorjs/validator.js)

## 📁 Project Structure

```
portfolio-bruno-nextjs/
├── src/
│   ├── components/
│   │   ├── email-template.tsx    # Email template for contact form
│   │   └── images/               # Image assets
│   ├── pages/
│   │   ├── api/
│   │   │   ├── send.ts          # Contact form API endpoint
│   │   │   └── hello.ts         # Sample API endpoint
│   │   ├── about.tsx            # About section
│   │   ├── contact.tsx          # Contact form section
│   │   ├── footer.tsx           # Footer component
│   │   ├── landingpage.tsx      # Hero/landing section
│   │   ├── navbar.tsx           # Navigation bar
│   │   ├── projects.tsx         # GitHub projects showcase
│   │   ├── index.tsx            # Main page
│   │   ├── _app.tsx             # App wrapper
│   │   └── _document.tsx        # HTML document structure
│   ├── styles/                  # CSS modules for each component
│   └── proxy.ts                 # Proxy utilities
├── __tests__/                   # Test files
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in git)
├── next.config.js              # Next.js configuration with security headers
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── jest.config.js              # Jest testing configuration
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:ci` | Run tests in CI environment |

## 🔒 Security Features

This project implements several security best practices:

- **Content Security Policy (CSP)** - Prevents XSS and data injection attacks
- **X-Frame-Options** - Protects against clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Referrer-Policy** - Controls referrer information
- **Permissions-Policy** - Restricts browser features (camera, microphone, geolocation)
- **Input Validation** - Server-side validation for all form inputs
- **Sanitization** - XSS prevention on user-generated content
- **Rate Limiting Ready** - Architecture supports rate limiting implementation

Security headers are configured in [next.config.js](next.config.js).

## 📧 Contact Form

The contact form uses the Resend API to send emails. Key features:

- Client-side validation using React Hook Form
- Server-side validation with strict input constraints
- Email sanitization and normalization
- XSS protection with input sanitization
- Toast notifications for user feedback
- Comprehensive error handling

### Form Validation Rules

- **Name**: 2-100 characters, no special control characters
- **Email**: Valid email format, max 254 characters
- **Message**: 10-5000 characters

## 🎯 Projects Section

Dynamically fetches public repositories from GitHub and displays them with:

- Repository name and description
- Programming language
- Star and fork counts
- Direct links to GitHub repos
- XSS protection with sanitization
- Error handling and loading states

## 🧪 Testing

The project includes comprehensive tests for critical components:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Tests are located in the `__tests__/` directory and cover:
- Projects component and GitHub API integration
- Contact form API endpoint validation
- Input sanitization functions

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- All open source contributors

---

Made with ❤️ using Next.js
