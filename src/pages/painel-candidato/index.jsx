import './style.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarCandidaturas, candidatarVaga } from '../../services/vagaService.js';
import { mensagemDeErro } from '../../services/api.js';

export default function PainelCandidato({ usuario, vagas }) {
  const [busca, setBusca] = useState('');
  const [candidaturas, setCandidaturas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregarCandidaturas() {
    try {
      const lista = await listarCandidaturas();
      setCandidaturas(lista);
      setErro('');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível carregar suas candidaturas.'));
    } finally {
      setCarregando(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregarCandidaturas(); }, []);

  async function candidatar(vaga) {
    setErro('');
    setMensagem('');

    try {
      await candidatarVaga(vaga.id);
      setMensagem('Sua candidatura foi enviada com sucesso.');
      await carregarCandidaturas();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível registrar a candidatura.'));
    }
  }

  const vagasFiltradas = vagas.filter((vaga) => {
    const texto = `${vaga.titulo} ${vaga.empresa} ${vaga.area} ${vaga.cidade}`;
    return texto.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <section className="painel">
      <div className="painel-topo cor-candidato">
        <p>ÁREA DO CANDIDATO</p>
        <h1>Olá, {usuario.nome}!</h1>
        <p>Encontre oportunidades e acompanhe suas candidaturas em um só lugar.</p>
        <span className="etiqueta">Área de interesse: {usuario.area || 'Não informada'}</span>
      </div>

      <div className="painel-conteudo">
        <div className="resumo">
          <div>
            <strong>{vagas.length}</strong>
            <span>vagas disponíveis</span>
          </div>
          <div>
            <strong>{candidaturas.length}</strong>
            <span>candidaturas feitas</span>
          </div>
        </div>

        <div className="titulo-acao">
          <div>
            <h2>Seu espaço profissional</h2>
            <p>Mantenha seu currículo atualizado e encontre novas oportunidades.</p>
          </div>
          <Link className="botao-link" to="/meu-curriculo">
            Editar meu currículo
          </Link>
        </div>

        {mensagem && <p className="mensagem">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}

        <div className="topo-lista">
          <h2>Vagas disponíveis</h2>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cargo, empresa ou cidade"
            aria-label="Buscar vagas"
          />
        </div>

        {vagasFiltradas.length === 0 ? (
          <div className="vazio">
            <h3>Nenhuma vaga encontrada</h3>
            <p>Tente pesquisar outro cargo ou área.</p>
          </div>
        ) : (
          <div className="lista-vagas">
            {vagasFiltradas.map((vaga) => (
              <article className="vaga" key={vaga.id}>
                <div className="info-vaga">
                  <h3>{vaga.titulo}</h3>
                  <p>{vaga.empresa} · {vaga.cidade}</p>
                  <span>{vaga.area} · {vaga.formato}</span>
                  <p className="salario">{vaga.salario || 'Salário a combinar'}</p>
                </div>
                <div className="botoes-vaga">
                  <Link className="botao-link" to={`/vagas/${vaga.id}`}>
                    Ver detalhes
                  </Link>
                  <button onClick={() => candidatar(vaga)}>
                    Candidatar-se
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="cartao">
          <h2>Minhas candidaturas</h2>

          {carregando && <p>Carregando candidaturas...</p>}

          {!carregando && candidaturas.length === 0 && (
            <p>Você ainda não se candidatou a uma vaga. Explore as oportunidades acima.</p>
          )}

          {candidaturas.map((item) => (
            <article className="candidatura" key={item.id}>
              <div>
                <h3>{item.titulo}</h3>
                <p>{item.empresa}</p>
                <span className="status">Status: {item.status || 'Recebido'}</span>
                {item.entrevista_data_hora && (
                  <p>
                    Entrevista: {new Date(item.entrevista_data_hora).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}