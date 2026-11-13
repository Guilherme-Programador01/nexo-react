import './style.scss';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

// Links do menu para cada tipo de pessoa
const linksVisitante = [
  { para: '/', texto: 'Início' },
  { para: '/vagas', texto: 'Buscar vagas' },
  { para: '/empresas', texto: 'Empresas' },
  { para: '/para-empresas', texto: 'Para empresas' },
  { para: '/sobre', texto: 'Como funciona' }
];

const linksCandidato = [
  { para: '/candidato', texto: 'Meu painel' },
  { para: '/meu-curriculo', texto: 'Meu currículo' },
  { para: '/vagas', texto: 'Buscar vagas' },
  { para: '/empresas', texto: 'Empresas' }
];

const linksEmpresa = [
  { para: '/empresa', texto: 'Meu painel' },
  { para: '/cadastrar-vaga', texto: 'Publicar vaga' },
  { para: '/curriculos', texto: 'Banco de currículos' },
  { para: '/vagas', texto: 'Ver vagas' },
  { para: '/empresas', texto: 'Empresas' }
];

export default function Header({ usuario, aoSair }) {
  // controla o menu aberto/fechado no celular
  const [menuAberto, setMenuAberto] = useState(false);
  const navegar = useNavigate();

  // escolhe a lista de links de acordo com quem está logado
  let links = linksVisitante;
  let paginaInicial = '/';

  if (usuario && usuario.tipo === 'empresa') {
    links = linksEmpresa;
    paginaInicial = '/empresa';
  } else if (usuario) {
    links = linksCandidato;
    paginaInicial = '/candidato';
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  function sair() {
    aoSair();
    fecharMenu();
    navegar('/');
  }

  return (
    <header className="cabecalho">
      <div className="container menu">
        <Link to={paginaInicial} className="logo" onClick={fecharMenu}>
          <img className="logo-completa" src="/imagens/nexo-logo.svg" alt="Nexo" />
        </Link>

        <button
          className="menu-mobile"
          onClick={function () { setMenuAberto(!menuAberto); }}
          aria-label="Abrir menu"
        >
          {menuAberto ? '×' : '☰'}
        </button>

        <nav className={menuAberto ? 'navegacao aberto' : 'navegacao'}>
          {links.map(function (link) {
            return (
              <NavLink
                key={link.para}
                to={link.para}
                end={link.para === '/'}
                onClick={fecharMenu}
              >
                {link.texto}
              </NavLink>
            );
          })}
        </nav>

        <div className="menu-acoes">
          {usuario ? (
            <button className="botao botao-principal botao-pequeno" onClick={sair}>
              Sair ({usuario.nome})
            </button>
          ) : (
            <>
              <Link className="botao botao-claro botao-pequeno" to="/entrar">
                Entrar
              </Link>
              <Link className="botao botao-principal botao-pequeno" to="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
