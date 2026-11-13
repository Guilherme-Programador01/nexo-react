import './style.scss';
import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <>
      <section className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">SOBRE O NEXO</span>
          <h1>Uma ponte entre quem procura trabalho e quem precisa contratar.</h1>
          <p>O Nexo é um projeto de TCC que organiza a aproximação entre candidatos e empresas por meio de uma plataforma de oportunidades profissionais.</p>
        </div>
      </section>
      <section className="secao">
        <div className="container sobre-colunas">
          <article className="sobre-cartao">
            <span className="sobre-numero">O DESAFIO</span>
            <h2>Encontrar uma oportunidade pode ser um processo difícil.</h2>
            <p>
              A busca por emprego envolve localizar vagas, entender requisitos, preparar
              currículos e acompanhar processos seletivos. Para as empresas, divulgar
              oportunidades e organizar candidaturas também exige tempo e informação.
              Quando esses dados ficam dispersos, a conexão entre os dois lados pode se
              tornar mais difícil.
            </p>
          </article>
          <div className="sobre-lista">
            <div><span>01</span><div><h3>Para candidatos</h3><p>Reunir informações profissionais, consultar oportunidades e acompanhar candidaturas em um só ambiente.</p></div></div>
            <div><span>02</span><div><h3>Para empresas</h3><p>Publicar vagas, receber candidaturas, consultar perfis e organizar as etapas da seleção.</p></div></div>
            <div><span>03</span><div><h3>O objetivo do Nexo</h3><p>Facilitar o acesso às informações e aproximar as necessidades das empresas das competências dos profissionais.</p></div></div>
          </div>
        </div>
      </section>
      <section className="secao-final">
        <div className="container caixa-final">
          <div><h2>Conheça as funcionalidades do Nexo.</h2><p>Escolha seu perfil e veja como a plataforma pode ajudar.</p></div>
          <Link to="/cadastro" className="botao botao-claro botao-grande">Criar uma conta</Link>
        </div>
      </section>
    </>
  );
}
