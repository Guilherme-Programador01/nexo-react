import './style.scss';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardVaga from '../../components/CardVaga/index.jsx';
import { AREAS, FORMATOS } from '../../constantes.js';

export default function Vagas({ vagas, vagasSaoDemo = false }) {
  const [params] = useSearchParams();

  const [termo, setTermo] = useState(params.get('busca') || '');
  const [area, setArea] = useState(params.get('area') || '');
  const [formato, setFormato] = useState('');

  const vagasFiltradas = vagas.filter((vaga) => {
    const textoDaVaga = `${vaga.titulo} ${vaga.empresa} ${vaga.cidade} ${(vaga.habilidades || []).join(' ')}`.toLowerCase();

    const combinaComBusca = textoDaVaga.includes(termo.toLowerCase());
    const combinaComArea = area === '' || vaga.area === area;
    const combinaComFormato = formato === '' || vaga.formato === formato;

    return combinaComBusca && combinaComArea && combinaComFormato;
  });

  return (
    <>
      <section className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">ENCONTRE SEU LUGAR</span>
          <h1>Oportunidades cadastradas no Nexo</h1>
          <p>Pesquise por cargo, empresa, área ou formato de trabalho e consulte os detalhes de cada vaga.</p>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="filtros-vaga">
            <label className="campo-pesquisa">
              <input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Cargo, empresa ou palavra-chave"
                aria-label="Buscar vagas"
              />
            </label>

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

            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              aria-label="Filtrar por formato"
            >
              <option value="">Todos os formatos</option>
              {FORMATOS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="linha-resultados">
            <strong>{vagasFiltradas.length} {vagasFiltradas.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"}</strong>
            {vagasSaoDemo && <span className="aviso-demo-vagas">Exibindo vagas de demonstração enquanto a API não fornece registros.</span>}
          </div>

          {vagasFiltradas.length > 0 ? (
            <div className="lista-vagas">
              {vagasFiltradas.map((vaga) => (
                <CardVaga key={vaga.id} vaga={vaga} demonstracao={vagasSaoDemo} />
              ))}
            </div>
          ) : (
            <div className="vazio">
              <h3>Nenhuma vaga encontrada</h3>
              <p>Tente mudar os filtros ou pesquisar outro termo.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}