# Nexo — front-end (TCC)

Site de vagas de emprego feito com **React**, **React Router**, **Sass** e **Axios**.
A API (Node.js + Express + MySQL) fica em outra pasta, a `nexo-api`.

## Como rodar

1. Rode a API primeiro (pasta `nexo-api`: configure o `.env`, importe o `database/nexo.sql` no MySQL e use `npm install` e `npm start`).
2. Nesta pasta, rode:

```
npm install
npm start
```

O site abre em `http://localhost:3000`.

A API padrão é `http://localhost:3001/api`. Para mudar, copie o `.env.example` para `.env` e altere o endereço.

> Se a API estiver desligada, o site mostra as vagas de exemplo (arquivo `src/dadosDemo.js`) sem aviso de erro na tela.

## O que o site faz

- Cadastro e login de **candidatos** e **empresas** (com token JWT).
- Busca de vagas por texto, área e formato (remoto, híbrido, presencial).
- Candidatura a vagas e acompanhamento no painel do candidato.
- Candidato monta o currículo no site ou envia um arquivo (PDF, DOC, DOCX até 5 MB).
- Empresa publica e exclui vagas, muda o status das candidaturas e agenda entrevistas.
- Empresa consulta o banco de currículos e pesquisa outras empresas.

O token do login fica só na memória do navegador. Se a página for recarregada, é preciso entrar de novo.

## Organização das pastas

```
public/imagens/   -> imagem do topo da página inicial
src/
  App.jsx         -> rotas (endereços) e estado do login
  constantes.js   -> listas usadas em vários lugares (áreas, formatos, status)
  dadosDemo.js    -> vagas de exemplo
  components/     -> peças reaproveitadas (Header, Footer, CardVaga, Icone)
  pages/          -> uma pasta por página (index.jsx + style.scss)
  services/       -> chamadas à API com Axios
  styles/         -> estilos globais em Sass
```

## Dicas para mexer no visual

- Cores e tamanhos: `src/styles/_variaveis.scss` (é só trocar as cores principais).
- Imagem do topo: `public/imagens/hero-pessoa.webp`.
- Textos da página inicial: `src/pages/inicio/index.jsx`.


## Atualização visual (tema roxo e verde)

O visual agora é claro, com **roxo** como cor principal e **verde** como cor de ação/sucesso:
- cores centralizadas em `src/styles/_variaveis.scss` (`--cor-principal` roxo, `--cor-verde` verde);
- hero com formas orgânicas, selos flutuantes (vagas ativas, empresas parceiras, candidatura em 1 clique), faixa de empresas e estatísticas;
- login com abas (candidato / empresa), mostrar-ocultar senha, validação visual e spinner;
- classe `.botao-verde` disponível para ações positivas (ex.: candidatar-se).

A estrutura React, as rotas e os serviços Axios foram preservados.
