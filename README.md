# Elion Engenharia e Construção — Site Institucional

Site premium desenvolvido com HTML5, CSS3 e JavaScript puro.
Deploy na Vercel via GitHub com CI/CD automático.

## Estrutura

```
elion-vercel/
├── index.html      ← site completo (CSS e JS embutidos, logo em base64)
├── vercel.json     ← configuração de deploy e headers de segurança
├── robots.txt      ← diretivas para motores de busca
├── sitemap.xml     ← mapa do site para indexação
├── og-image.jpg    ← imagem de preview social (1200×630 px) — ver abaixo
├── .gitignore      ← exclusões do repositório
└── README.md       ← este arquivo
```

## Deploy via GitHub + Vercel (recomendado)

1. Faça push deste repositório para o GitHub
2. Acesse [vercel.com/new](https://vercel.com/new) e conecte o repositório
3. Clique em **Deploy** — a Vercel detecta automaticamente o `vercel.json`
4. A cada novo `git push`, o site é atualizado automaticamente

## Deploy direto (sem GitHub)

```bash
npm i -g vercel
cd elion-vercel
vercel
```

## Segurança

O `vercel.json` aplica os seguintes headers em produção:

| Header | Valor |
|--------|-------|
| Content-Security-Policy | Restringe fontes de scripts, estilos, imagens e fontes |
| Strict-Transport-Security | HTTPS forçado por 2 anos |
| X-Frame-Options | DENY — impede clickjacking |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Desativa câmera, mic, geolocalização, pagamento |

## Antes de ir ao ar — checklist

- [ ] Criar `og-image.jpg` (1200×630 px, < 150 KB) e adicionar à raiz do repo
- [ ] Substituir URLs `elionengenharia.com.br` pelo domínio real (se diferente)
- [ ] Atualizar telefone, e-mail e CNPJ reais no `index.html`
- [ ] Adicionar links reais do Instagram e LinkedIn (HTML + JSON-LD `sameAs`)
- [ ] Substituir imagens Unsplash por fotos reais dos projetos
- [ ] Configurar domínio personalizado nas configurações da Vercel

## Refinamentos futuros

- Integração do formulário de contato com serviço de e-mail (ex: Formspree, Resend)
- Favicon e ícones de app (`favicon.ico`, `apple-touch-icon.png`)
- Fotos reais da equipe e portfólio
- Google Analytics / Vercel Analytics
