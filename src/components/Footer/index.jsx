import './style.scss';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grade">
        <div className="footer-marca">
          <Link to="/" className="logo">
            <img className="logo-completa" src="/imagens/nexo-logo.svg" alt="Nexo" />
          </Link>
          <p>Conectando talentos a oportunidades. Um espaço para aproximar pessoas e empresas.</p>
        </div>
        <div className="footer-coluna">
          <strong>Plataforma</strong>
          <Link to="/vagas">Buscar vagas</Link>
          <Link to="/empresas">Empresas</Link>
          <Link to="/sobre">Como funciona</Link>
        </div>
        <div className="footer-coluna">
          <strong>Para você</strong>
          <Link to="/cadastro">Criar conta</Link>
          <Link to="/entrar">Entrar</Link>
          <Link to="/sobre">Sobre o Nexo</Link>
        </div>
        <div className="footer-coluna">
          <strong>Para empresas</strong>
          <Link to="/para-empresas">Conhecer a plataforma</Link>
          <Link to="/cadastro">Cadastrar empresa</Link>
          <Link to="/entrar">Acessar conta</Link>
        </div>
      </div>
      <div className="container footer-base">
        <span>© 2026 Nexo. Projeto acadêmico de conclusão de curso.</span>
        <span>Conectando oportunidades e talentos.</span>
      </div>
    </footer>
  );
}
