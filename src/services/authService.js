import api from './api.js';

// Cria uma conta nova (candidato ou empresa)
export async function cadastrarConta(dados) {
  const resposta = await api.post('/usuarios/cadastro', dados);
  return resposta.data;
}

// Faz o login e devolve o token
export async function fazerLogin(email, senha) {
  const resposta = await api.post('/usuarios/login', { email, senha });
  return resposta.data;
}

// Busca os dados da pessoa que está logada
export async function buscarPerfil() {
  const resposta = await api.get('/usuarios/perfil');
  return resposta.data;
}

// Salva as alterações do perfil / currículo
export async function atualizarPerfil(dados) {
  const resposta = await api.put('/usuarios/perfil', dados);
  return resposta.data;
}

// Envia o arquivo do currículo (PDF, DOC ou DOCX)
export async function enviarArquivoCurriculo(arquivo) {
  const dados = new FormData();
  dados.append('curriculo', arquivo);

  const resposta = await api.post('/usuarios/curriculo', dados);
  return resposta.data;
}
