import './style.scss';
import { useEffect, useState } from 'react';
import { listarEmpresas } from '../../services/contaService.js';
import { mensagemDeErro } from '../../services/api.js';
import { AREAS } from '../../constantes.js';

export default function BuscaEmpresas() {
  const [busca, setBusca] = useState('');
  const [cidade, setCidade] = useState('');
  const [area, setArea] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function pesquisar(evento) {
    if (evento) evento.preventDefault();

    setCarregando(true);
    setErro('');

    try {
      const lista = await listarEmpresas({ busca, cidade, area });
      setEmpresas(lista);
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível pesquisar empresas.'));
    } finally {
      setCarregando(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { pesquisar(); }, []);

  return (
    <section className="busca-empresas-pagina">
      <div className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">CONEXÕES PROFISSIONAIS</span>
          <h1>Encontre empresas que combinam com seus objetivos.</h1>
          <p>Pesquise por nome, área de atuação ou cidade e conheça as empresas cadastradas no Nexo.</p>
        </div>
      </div>

      <div className="container conteudo-pagina">
        <form className="filtros-empresas" onSubmit={pesquisar}>
          <label>
            Empresa ou palavra-chave
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: tecnologia, atendimento..."
            />
          </label>
          <label>
            Cidade
            <input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex.: Campinas, SP"
            />
          </label>
          <label>
            Área
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Todas as áreas</option>
              {AREAS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button className="botao botao-principal" type="submit" disabled={carregando}>
            {carregando ? 'Buscando...' : 'Pesquisar'}
          </button>
        </form>

        {erro && <p className="erro">{erro}</p>}

        <p className="contagem-empresas">
          {carregando ? 'Carregando empresas...' : `${empresas.length} empresa(s) encontrada(s)`}
        </p>

        {empresas.length > 0 && (
          <div className="lista-empresas">
            {empresas.map((empresa) => {
              const local = [empresa.cidade, empresa.estado].filter(Boolean).join(' · ');

              return (
                <article className="cartao-empresa-busca" key={empresa.usuario_id}>
                  <span className="marca-empresa">
                    {String(empresa.nome || 'E').charAt(0).toUpperCase()}
                  </span>
                  <div className="dados-empresa">
                    <h2>{empresa.nome}</h2>
                    <p>{empresa.area || 'Área não informada'}</p>
                    <span>{local || 'Localidade não informada'}</span>
                    {empresa.descricao && <p className="descricao-empresa">{empresa.descricao}</p>}
                  </div>
                  {empresa.site && (
                    <a href={empresa.site} target="_blank" rel="noreferrer">
                      Site da empresa
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!carregando && !erro && empresas.length === 0 && (
          <div className="vazio">
            <h2>Nenhuma empresa encontrada</h2>
            <p>Experimente pesquisar outro nome, área ou cidade.</p>
          </div>
        )}
      </div>
    </section>
  );
}