import './style.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  listarMinhasVagas,
  listarCandidaturas,
  atualizarStatusCandidatura,
  marcarEntrevista
} from '../../services/vagaService.js';
import { mensagemDeErro } from '../../services/api.js';
import { STATUS } from '../../constantes.js';

function nomeDoCandidato(item) {
  return item.nome_candidato || item.nomeCandidato || 'Candidato';
}

export default function PainelEmpresa({ usuario, aoExcluirVaga, aoSair }) {
  const navegar = useNavigate();

  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      const listaVagas = await listarMinhasVagas();
      const listaCandidaturas = await listarCandidaturas();

      setVagas(listaVagas);
      setCandidaturas(listaCandidaturas);
      setErro('');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível carregar os dados da empresa.'));
    } finally {
      setCarregando(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); }, []);

  async function mudarStatus(candidatura, novoStatus) {
    try {
      await atualizarStatusCandidatura(candidatura.id, novoStatus);
      setMensagem('Status atualizado.');
      await carregar();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível atualizar o status.'));
    }
  }

  async function agendarEntrevista(candidatura, dataHora) {
    if (!dataHora) return;

    try {
      await marcarEntrevista(candidatura.id, {
        data_hora: dataHora.replace('T', ' '),
        observacoes: ''
      });
      setMensagem('Entrevista agendada.');
      await carregar();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível agendar a entrevista.'));
    }
  }

  async function excluir(vaga) {
    if (!window.confirm(`Excluir a vaga "${vaga.titulo}"?`)) return;

    try {
      await aoExcluirVaga(vaga.id);
      setMensagem('Vaga excluída.');
      await carregar();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível excluir a vaga.'));
    }
  }

  const candidaturasUnicas = candidaturas.filter((item, indice, lista) => {
    return lista.findIndex((outro) => String(outro.id) === String(item.id)) === indice;
  });

  const candidaturasVisiveis = candidaturasUnicas.filter((item) => {
    const texto = `${nomeDoCandidato(item)} ${item.titulo || ''} ${item.habilidades || ''} ${item.email || ''}`.toLowerCase();
    const statusDoItem = item.status || 'Recebido';

    const combinaComBusca = texto.includes(busca.toLowerCase());
    const combinaComStatus = filtroStatus === 'Todos' || statusDoItem === filtroStatus;

    return combinaComBusca && combinaComStatus;
  });

  const totalEntrevistas = candidaturas.filter((item) => item.entrevista_data_hora).length;

  return (
    <section className="painel">
      <div className="painel-topo cor-empresa">
        <p>ÁREA DA EMPRESA</p>
        <h1>Olá, {usuario.nome}!</h1>
        <p>Publique oportunidades, encontre talentos e organize as etapas da seleção.</p>
        <span className="etiqueta">Área de atuação: {usuario.area}</span>
      </div>

      <div className="painel-conteudo">
        <div className="resumo">
          <div>
            <strong>{vagas.length}</strong>
            <span>vagas publicadas</span>
          </div>
          <div>
            <strong>{candidaturas.length}</strong>
            <span>candidaturas recebidas</span>
          </div>
          <div>
            <strong>{totalEntrevistas}</strong>
            <span>entrevistas marcadas</span>
          </div>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}

        <div className="titulo-acao">
          <h2>Suas oportunidades</h2>
          <Link className="botao-link" to="/cadastrar-vaga">
            Publicar vaga
          </Link>
        </div>

        {carregando && <p>Carregando...</p>}

        {!carregando && vagas.length === 0 && (
          <div className="vazio">
            <h3>Você ainda não publicou vagas</h3>
            <p>Publique uma oportunidade para começar a receber candidatos.</p>
            <Link className="botao-link" to="/cadastrar-vaga">
              Cadastrar primeira vaga
            </Link>
          </div>
        )}

        {vagas.length > 0 && (
          <div className="lista-vagas">
            {vagas.map((vaga) => (
              <article className="vaga" key={vaga.id}>
                <div className="info-vaga">
                  <h3>{vaga.titulo}</h3>
                  <p>{vaga.cidade} · {vaga.formato}</p>
                  <span>{vaga.area}</span>
                </div>
                <div className="botoes-vaga">
                  <Link className="botao-link" to={`/vagas/${vaga.id}`}>
                    Ver vaga
                  </Link>
                  <button className="botao-perigo" onClick={() => excluir(vaga)}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="secao-candidatos">
          <div className="etapas-selecao" aria-label="Resumo das etapas de seleção">
            {STATUS.map((status) => (
              <div className="etapa-resumo" key={status}>
                <span>{status}</span>
                <strong>{candidaturasUnicas.filter((item) => (item.status || 'Recebido') === status).length}</strong>
              </div>
            ))}
          </div>
          <div className="topo-lista">
            <div>
              <h2>Gerenciar candidatos</h2>
              <p>Atualize o status e agende entrevistas para as candidaturas recebidas.</p>
            </div>
            <Link className="botao-link" to="/curriculos">
              Banco de currículos
            </Link>
          </div>

          <div className="filtros">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar candidato, habilidade ou vaga"
              aria-label="Buscar candidatos"
            />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              aria-label="Filtrar por status"
            >
              <option>Todos</option>
              {STATUS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          {candidaturasVisiveis.length === 0 ? (
            <div className="vazio">
              <h3>Nenhuma candidatura encontrada</h3>
              <p>Quando alguém se candidatar a uma de suas vagas, aparecerá aqui.</p>
            </div>
          ) : (
            <div className="lista-candidatos">
              {candidaturasVisiveis.map((item) => (
                <article className="cartao-candidato" key={item.id}>
                  <div className="dados-candidato">
                    <span className="avatar">
                      {nomeDoCandidato(item).charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h3>{nomeDoCandidato(item)}</h3>
                      <p>{item.titulo}</p>
                      <small>
                        {item.area || 'Área não informada'} · {item.habilidades || 'Habilidades não informadas'}
                      </small>
                      <p className="email">{item.email}</p>
                    </div>
                  </div>

                  <div className="acoes-candidato">
                    <label>
                      Status
                      <select
                        value={item.status || 'Recebido'}
                        onChange={(e) => mudarStatus(item, e.target.value)}
                      >
                        {STATUS.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Data e hora da entrevista
                      <input
                        type="datetime-local"
                        onChange={(e) => agendarEntrevista(item, e.target.value)}
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <button
          className="sair"
          onClick={() => {
            aoSair();
            navegar('/');
          }}
        >
          Sair da conta
        </button>
      </div>
    </section>
  );
}