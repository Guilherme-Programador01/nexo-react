import api from './api.js';

// Banco de currículos (só empresas conseguem acessar)
export async function listarCurriculos(filtros) {
  const resposta = await api.get('/empresas/curriculos', { params: filtros });

  // A API manda "usuario_id"; aqui usamos "id" para ficar mais simples
  return resposta.data.map(function (candidato) {
    return { ...candidato, id: candidato.usuario_id };
  });
}

// Pesquisa de empresas
export async function listarEmpresas(filtros) {
  const resposta = await api.get('/empresas', { params: filtros });
  return resposta.data;
}
