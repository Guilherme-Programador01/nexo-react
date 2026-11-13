import './style.scss';
import { useEffect, useState } from 'react';
import { listarCurriculos } from '../../services/contaService.js';
import { mensagemDeErro, urlDoServidor } from '../../services/api.js';
import { AREAS } from '../../constantes.js';

export default function BancoCurriculos({ usuario }) {
  const [busca, setBusca] = useState('');
  const [area, setArea] = useState('');
  const [cidade, setCidade] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function pesquisar(evento) {
    if (evento) evento.preventDefault();

    setCarregando(true);
    setErro('');

    try {
      const lista = await listarCurriculos({ busca, area, cidade });

      lista.sort((a, b) => Number(b.area === usuario.area) - Number(a.area === usuario.area));

      setCandidatos(lista);
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível carregar os currículos.'));
    } finally {
      setCarregando(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { pesquisar(); }, []);

  return (
    <section>
      <div className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">ÁREA DA EMPRESA</span>
          <h1>Banco de currículos</h1>
          <p>Pesquise candidatos por nome, área, cidade, experiência, formação ou habilidades.</p>
        </div>
      </div>

      <div className="container conteudo-pagina">
        <form className="filtros" onSubmit={pesquisar}>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome, experiência ou habilidade"
            aria-label="Buscar currículos"
          />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label="Filtrar por área"
          >
            <option value="">Todas as áreas</option>
            {AREAS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            aria-label="Filtrar por cidade"
          />
          <button className="botao botao-principal" type="submit" disabled={carregando}>
            {carregando ? 'Buscando...' : 'Pesquisar'}
          </button>
        </form>

        <p className="resultados">
          {carregando ? 'Pesquisando candidatos...' : `${candidatos.length} perfil(is) encontrado(s)`}
        </p>

        {erro && <p className="erro">{erro}</p>}

        {!carregando && !erro && candidatos.length === 0 && (
          <div className="vazio">
            <h3>Nenhum currículo encontrado</h3>
            <p>Experimente mudar a palavra pesquisada ou os filtros.</p>
          </div>
        )}

        {candidatos.length > 0 && (
          <div className="lista-curriculos">
            {candidatos.map((candidato) => (
              <article className="cartao-curriculo" key={candidato.id}>
                <div className="dados-candidato">
                  <span className="avatar">
                    {String(candidato.nome || 'C').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h2>{candidato.nome}</h2>
                    <p>{candidato.area || 'Área não informada'}</p>
                    <small>{candidato.cidade || 'Cidade não informada'}</small>
                  </div>
                </div>

                <div className="detalhe-curriculo">
                  <strong>Resumo</strong>
                  <p>{candidato.resumo || 'Não informado'}</p>
                </div>
                <div className="detalhe-curriculo">
                  <strong>Experiência</strong>
                  <p>{candidato.experiencia || 'Não informada'}</p>
                </div>
                <div className="detalhe-curriculo">
                  <strong>Habilidades</strong>
                  <p>{candidato.habilidades || 'Não informadas'}</p>
                </div>
                <div className="detalhe-curriculo">
                  <strong>Formação</strong>
                  <p>{candidato.escolaridade || 'Não informada'}</p>
                </div>

                <p className="email">Contato: {candidato.email || 'Não informado'}</p>

                {candidato.curriculo_url && (
                  <a href={urlDoServidor + candidato.curriculo_url} target="_blank" rel="noreferrer">
                    Abrir currículo anexado
                  </a>
                )}

                {candidato.area === usuario.area && (
                  <span className="compativel">Área compatível</span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}