import axios from 'axios';

// Endereço da API. Pode ser mudado no arquivo .env (veja o .env.example)
const urlDaApi = process.env.REACT_APP_API_URL || 'http://localhost:2024/api';

// Endereço do servidor sem o "/api" (usado para abrir os currículos enviados)
export const urlDoServidor = urlDaApi.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: urlDaApi,
  timeout: 15000
});

// O token do login fica guardado só na memória.
// Se a página for recarregada, é preciso entrar de novo.
let token = null;

export function salvarToken(novoToken) {
  token = novoToken;
}

export function limparToken() {
  token = null;
}

// Antes de cada requisição, envia o token (se a pessoa estiver logada)
api.interceptors.request.use(function (config) {
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Transforma o erro da API em uma mensagem simples para mostrar na tela
export function mensagemDeErro(erro, mensagemPadrao) {
  if (erro.response && erro.response.data && erro.response.data.erro) {
    return erro.response.data.erro;
  }

  if (erro.code === 'ERR_NETWORK' || erro.code === 'ECONNABORTED') {
    return 'Não foi possível conectar à API. Confira se ela está rodando.';
  }

  return mensagemPadrao || 'Não foi possível concluir a operação.';
}

export default api;
