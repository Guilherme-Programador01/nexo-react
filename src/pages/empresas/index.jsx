import './style.scss';
import { Link } from 'react-router-dom';
import Icone from '../../components/Icone/index.jsx';

export default function Empresas() {
  return (
    <>
      <section className="destaque-empresa">
        <div className="container colunas-empresa">
          <div>
            <span className="subtitulo">PARA EMPRESAS</span>
            <h1>
              Encontre pessoas. <span>Construa possibilidades.</span>
            </h1>
            <p>
              Divulgue suas vagas e aproxime sua empresa de candidatos com as
              habilidades que você procura.
            </p>
            <Link to="/cadastrar-vaga" className="botao botao-principal botao-grande">
              Divulgar uma vaga →
            </Link>
          </div>

          <div className="ilustracao-empresa">
            <div className="icone-empresa"></div>
            <div className="cartao-empresa">Candidatos com o perfil certo</div>
            <div className="cartao-empresa segundo">Mais clareza na seleção</div>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cabecalho-secao centralizado">
            <span className="subtitulo">RECRUTAMENTO MAIS SIMPLES</span>
            <h2>Do anúncio à conexão.</h2>
            <p>Ferramentas para deixar seu processo mais organizado.</p>
          </div>

          <div className="lista-etapas">
            <div className="cartao-etapa">
              <span className="icone-etapa">
                <Icone nome="curriculo" />
              </span>
              <h3>Publique sua vaga</h3>
              <p>Informe cargo, área, local, formato e habilidades necessárias.</p>
            </div>

            <div className="cartao-etapa">
              <span className="icone-etapa">
                <Icone nome="usuario" />
              </span>
              <h3>Conheça os talentos</h3>
              <p>Organize as candidaturas e consulte o banco de currículos.</p>
            </div>

            <div className="cartao-etapa">
              <span className="icone-etapa">
                <Icone nome="check" />
              </span>
              <h3>Agende entrevistas</h3>
              <p>Atualize o status de cada candidato e marque a data da entrevista.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}