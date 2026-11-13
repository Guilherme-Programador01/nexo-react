import './style.scss';
import { Link } from 'react-router-dom';

export default function CardVaga({ vaga, demonstracao = false }) {
  const iniciais = (vaga.empresa || 'Nexo')
    .split(' ').filter(Boolean).map((palavra) => palavra.charAt(0)).join('').slice(0, 2).toUpperCase();

  return (
    <article className="vaga card-vaga">
      <div className="vaga-topo">
        <div className="empresa-logo">{iniciais}</div>
        <div className="vaga-titulo">
          <span className={demonstracao ? 'tipo-vaga tipo-demo' : 'tipo-vaga'}>{demonstracao ? 'DEMONSTRAÇÃO' : 'CADASTRADA'}</span>
          <h3>{vaga.titulo}</h3>
          <p>{vaga.empresa}</p>
        </div>
      </div>
      <div className="vaga-detalhes">
        <span>{vaga.cidade || 'Local não informado'}</span>
        <span>{vaga.formato || 'Formato não informado'}</span>
        {vaga.area && <span>{vaga.area}</span>}
      </div>
      {(vaga.habilidades || []).length > 0 && (
        <div className="lista-etiquetas">
          {vaga.habilidades.slice(0, 4).map((habilidade) => <span className="etiqueta" key={habilidade}>{habilidade}</span>)}
        </div>
      )}
      <div className="vaga-rodape">
        <div><small>Salário</small><strong>{vaga.salario || 'A combinar'}</strong></div>
        <Link className="botao botao-borda" to={'/vagas/' + vaga.id}>Ver detalhes</Link>
      </div>
    </article>
  );
}
