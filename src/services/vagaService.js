import api from './api.js';

// Monta o texto do salário (ex.: "R$ 2500 – R$ 3000")
function formatarSalario(vaga) {
  if (vaga.salario) {
    return String(vaga.salario);
  }

  if (vaga.salario_min && vaga.salario_max) {
    return 'R$ ' + vaga.salario_min + ' – R$ ' + vaga.salario_max;
  }

  if (vaga.salario_min || vaga.salario_max) {
    return 'R$ ' + (vaga.salario_min || vaga.salario_max);
  }

  return '';
}

// Deixa a vaga que veio da API no formato que o site usa
export function converterVaga(vaga) {
  // as habilidades chegam como texto separado por vírgula
  const textoHabilidades = String(vaga.habilidades || vaga.requisitos || '');
  const habilidades = textoHabilidades
    .split(',')
    .map(function (item) { return item.trim(); })
    .filter(function (item) { return item !== ''; });

  return {
    ...vaga,
    empresa: vaga.empresa || vaga.nome_empresa || '',
    cidade: vaga.cidade || vaga.cidade_empresa || '',
    formato: vaga.formato || 'Presencial',
    area: vaga.area || '',
    salario: formatarSalario(vaga),
    descricao: vaga.descricao || '',
    habilidades: habilidades
  };
}

export async function listarVagas() {
  const resposta = await api.get('/vagas');
  return resposta.data.map(converterVaga);
}

export async function criarVaga(vaga) {
  // O campo salário é um texto como "R$ 2.500 – R$ 3.000".
  // Aqui separamos o mínimo e o máximo para enviar como números.
  const partes = String(vaga.salario || '').split(/[–-]/);
  const valores = [];

  partes.forEach(function (parte) {
    const numero = Number(parte.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (numero > 0) {
      valores.push(numero);
    }
  });

  const resposta = await api.post('/vagas', {
    titulo: vaga.titulo,
    cidade: vaga.cidade,
    formato: vaga.formato,
    area: vaga.area,
    salario_min: valores[0] || null,
    salario_max: valores[1] || valores[0] || null,
    descricao: vaga.descricao,
    requisitos: vaga.habilidades.join(', ')
  });

  return converterVaga(resposta.data);
}

export async function excluirVaga(id) {
  await api.delete('/vagas/' + id);
}

// Vagas publicadas pela empresa que está logada
export async function listarMinhasVagas() {
  const resposta = await api.get('/vagas/minhas');
  return resposta.data.map(converterVaga);
}

export async function candidatarVaga(vagaId) {
  const resposta = await api.post('/vagas/' + vagaId + '/candidaturas', { mensagem: '' });
  return resposta.data;
}

export async function listarCandidaturas() {
  const resposta = await api.get('/candidaturas');
  return resposta.data;
}

export async function atualizarStatusCandidatura(id, status) {
  const resposta = await api.patch('/candidaturas/' + id + '/status', { status });
  return resposta.data;
}

export async function marcarEntrevista(id, dados) {
  const resposta = await api.post('/candidaturas/' + id + '/entrevistas', dados);
  return resposta.data;
}
