# Spotify Trainee - Front-end

Front-end de um clone do Spotify, desenvolvido como projeto treinee da **CATI Jr.**. Construído com **React**, **TypeScript**, **Vite** e **Tailwind CSS**, consumindo a API REST do [back-end em Spring Boot](https://github.com/ArthurHB8/treinee-spotify-2026-backend) (repositório separado).

**Deploy ao vivo:** https://arthur-projeto-spotify.vercel.app

## Funcionalidades

- Navegação por início, artistas, álbuns e playlists
- Busca com painel de resultados em tempo real e página de busca dedicada, com filtros por tipo
- Player de áudio persistente (barra inferior) com fila de reprodução
- Criação, edição, exclusão e reordenação de faixas em playlists (drag-and-drop)
- Upload de imagem de capa para playlists, álbuns e artistas
- Layout responsivo com comportamento dedicado para telas de celular

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS v4
- @dnd-kit (reordenação de faixas via arrastar-e-soltar)

## Pré-requisitos

- Node.js 20+
- O [back-end](https://github.com/ArthurHB8/treinee-spotify-2026-backend) rodando e acessível — sem ele, qualquer página que busca dados mostrará seu estado de erro

## Configuração

A URL base da API é lida da variável de ambiente `VITE_API_BASE_URL` (ver `.env.development`, que aponta para `http://localhost:8080` por padrão). Ajuste esse valor se o back-end estiver rodando em outro host/porta.

## Rodando localmente

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Para acessar a partir de outro dispositivo na mesma rede (ex: testar em um celular), use `npm run dev -- --host` e acesse pelo IP da máquina na rede local.

## Deploy

O front-end é hospedado na **Vercel** (https://arthur-projeto-spotify.vercel.app), configurada para build automático a partir deste repositório. Como a aplicação usa rotas client-side (`react-router-dom` com `BrowserRouter`), o arquivo `vercel.json` redireciona todas as rotas não encontradas para `index.html`, permitindo recarregar a página em qualquer rota (ex: `/album/:id`) sem erro 404.

O back-end correspondente é hospedado no **Render**.
