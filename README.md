# Style Studio Pro

Um aplicativo web moderno para gerir o teu roupeiro pessoal e criar outfits.

## 🚀 Funcionalidades

- **Gestão de Roupeiro**: Adiciona, organiza e remove peças de roupa
- **Criação de Outfits**: Combina peças para criar looks únicos
- **Upload de Fotos**: Suporte para câmara e upload de ficheiros
- **Compressão Automática**: Fotos são automaticamente comprimidas para < 2MB
- **Filtros**: Filtra por categoria e pesquisa por nome
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias

- **Framework**: TanStack Start (React + Vite)
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI + shadcn/ui
- **TypeScript**: TypeScript 5
- **Icons**: Lucide React

## 📦 Instalação

```bash
# Instalar dependências
bun install

# ou com npm
npm install
```

## 🏃 Como Executar

```bash
# Modo desenvolvimento
bun run dev

# ou com npm
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 🔨 Build

```bash
# Build para produção
bun run build

# ou com npm
npm run build
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes UI reutilizáveis
├── hooks/         # Custom React hooks
├── lib/           # Utilitários e tipos
├── routes/        # Páginas da aplicação
└── styles.css     # Estilos globais
```

## 🎨 Personalização

### Cores e Estilos

Os estilos estão configurados em `src/styles.css` e utilizam TailwindCSS. Podes personalizar as cores editando as variáveis CSS.

### Componentes UI

Os componentes estão em `src/components/ui/` e são baseados no shadcn/ui.

## 📱 Funcionalidades Mobile

- Interface otimizada para touch
- Suporte para câmara nativa
- Layout responsivo adaptativo

## 🔧 Scripts Disponíveis

- `bun run dev` - Inicia servidor de desenvolvimento
- `bun run build` - Build para produção
- `bun run lint` - Verifica erros de código
- `bun run format` - Formata o código

## 📝 Licença

Este projeto é privado e propriedade do autor.

## 🤝 Suporte

Para questões ou sugestões, contacta o autor.
