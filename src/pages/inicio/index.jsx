import './style.scss';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Inicio({ vagas = [], vagasSaoDemo = false }) {
  useEffect(() => {
    document.documentElement.classList.add('pagina-inicio');
    return () => document.documentElement.classList.remove('pagina-inicio');
  }, []);

  const vagasDestaque = vagas.slice(0, 3);

  return (
    <div className="inicio-simples">
      <section className="hero-nexo" aria-label="Nexo: conexão além do digital">
        <img
          className="hero-imagem-oficial"
          src="/imagens/nexo-banner-hd.webp"
          width="2560"
          height="1640"
          fetchpriority="high"
          alt="Nexo — conexão além do digital"
        />
      </section>

      <section className="introducao-nexo">
        <div className="container introducao-conteudo">
          <span className="etiqueta-inicio">PLATAFORMA DE OPORTUNIDADES PROFISSIONAIS</span>
          <h1>Encontre oportunidades. Conheça novos talentos.</h1>
          <p>
            O Nexo aproxima candidatos e empresas em um só lugar. Quem procura trabalho
            encontra vagas e acompanha candidaturas. Quem contrata publica oportunidades
            e organiza os processos seletivos.
          </p>
          <div className="introducao-acoes">
            <Link to="/vagas" className="botao botao-principal botao-grande">Buscar vagas</Link>
            <Link to="/para-empresas" className="link-empresa">Sou uma empresa</Link>
          </div>
        </div>
      </section>

      <section className="perfis-nexo">
        <div className="container">
          <div className="cabecalho-secao">
            <span className="etiqueta-roxa">DOIS caminhos, uma conexão</span>
            <h2>O que você precisa fazer no Nexo?</h2>
            <p>Escolha seu perfil e acesse as ferramentas certas para sua necessidade.</p>
          </div>
          <div className="perfis-grade">
            <article className="perfil-card perfil-candidato">
              <span className="perfil-numero">01 / CANDIDATO</span>
              <h3>Quero encontrar uma oportunidade</h3>
              <p>Consulte vagas, monte seu currículo e acompanhe o andamento das suas candidaturas.</p>
              <ul>
                <li>Pesquisar vagas por área e formato</li>
                <li>Manter seus dados profissionais atualizados</li>
                <li>Acompanhar suas candidaturas</li>
              </ul>
              <Link to="/vagas" className="botao botao-principal">Encontrar vagas</Link>
            </article>
            <article className="perfil-card perfil-empresa">
              <span className="perfil-numero">02 / EMPRESA</span>
              <h3>Quero encontrar profissionais</h3>
              <p>Divulgue oportunidades, receba currículos e acompanhe as etapas da seleção.</p>
              <ul>
                <li>Cadastrar e gerenciar vagas</li>
                <li>Consultar candidatos interessados</li>
                <li>Atualizar status e agendar entrevistas</li>
              </ul>
              <Link to="/para-empresas" className="botao botao-verde">Acessar área da empresa</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="como-funciona">
        <div className="container">
          <div className="cabecalho-secao">
            <span className="etiqueta-roxa">COMO FUNCIONA</span>
            <h2>Da busca ao acompanhamento</h2>
            <p>As principais etapas para cada perfil.</p>
          </div>
          <div className="lista-passos">
            <article className="passo">
              <span className="passo-numero">01</span>
              <div><h3>Crie seu perfil</h3><p>Informe seus dados e apresente suas experiências, formação e habilidades.</p></div>
            </article>
            <article className="passo">
              <span className="passo-numero">02</span>
              <div><h3>Encontre a conexão</h3><p>Candidatos exploram vagas. Empresas publicam oportunidades e recebem inscrições.</p></div>
            </article>
            <article className="passo">
              <span className="passo-numero">03</span>
              <div><h3>Acompanhe as etapas</h3><p>Consulte suas candidaturas ou organize os candidatos recebidos no painel.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="secao-talentos">
        <div className="container talentos-conteudo">
          <div className="talentos-foto-wrap">
            <img src="/imagens/nexo-talentos.png" alt="Profissional sorrindo em um ambiente de trabalho" />
          </div>
          <div className="talentos-texto">
            <span className="etiqueta-roxa">SOBRE O PROJETO</span>
            <h2>Oportunidades mais próximas de quem procura.</h2>
            <p>
              O Nexo foi pensado para facilitar o contato entre pessoas em busca de
              trabalho e empresas com vagas abertas. A plataforma organiza as informações
              profissionais e torna o processo de busca e seleção mais simples.
            </p>
            <Link to="/sobre" className="link-empresa">Conheça o projeto</Link>
          </div>
        </div>
      </section>

      <section className="vagas-inicio">
        <div className="container">
          <div className="cabecalho-vagas">
            <div>
              <span className="etiqueta-roxa">OPORTUNIDADES</span>
              <h2>Vagas disponíveis</h2>
              <p>Consulte os detalhes e veja quais oportunidades combinam com seu perfil.</p>
              {vagasSaoDemo && <span className="aviso-demo">Exemplos para demonstração</span>}
            </div>
            <Link to="/vagas" className="link-ver-todas">Ver todas as vagas →</Link>
          </div>

          {vagasDestaque.length > 0 ? (
            <div className="vagas-destaque-lista">
              {vagasDestaque.map((vaga) => (
                <article className="vaga-destaque" key={vaga.id}>
                  <div className="vaga-destaque-topo">
                    <span className="vaga-marcador">{vagasSaoDemo ? 'VAGA DE DEMONSTRAÇÃO' : 'VAGA CADASTRADA'}</span>
                    <span className="vaga-area">{vaga.area || 'Área não informada'}</span>
                  </div>
                  <h3>{vaga.titulo || vaga.cargo || 'Oportunidade profissional'}</h3>
                  <p className="vaga-empresa">{vaga.empresa || vaga.nomeEmpresa || 'Empresa participante'}</p>
                  <div className="vaga-dados">
                    <span>{vaga.cidade || vaga.localizacao || 'Local não informado'}</span>
                    <span>{vaga.formato || 'Formato não informado'}</span>
                  </div>
                  <strong className="vaga-salario">{vaga.salario || 'Salário a combinar'}</strong>
                  <Link to={`/vagas/${vaga.id}`}>Ver detalhes da vaga →</Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="vagas-vazias">
              <h3>Nenhuma vaga cadastrada no momento</h3>
              <p>Volte em breve ou conheça as empresas que fazem parte do Nexo.</p>
              <Link to="/empresas" className="botao botao-principal">Conhecer empresas</Link>
            </div>
          )}
        </div>
      </section>

      <section className="secao-final">
        <div className="container caixa-final">
          <div>
            <span className="etiqueta-final">NEXO</span>
            <h2>Comece pelo seu próximo passo.</h2>
            <p>Crie seu perfil para buscar vagas ou cadastrar oportunidades.</p>
          </div>
          <div className="final-acoes">
            <Link to="/cadastro" className="botao botao-claro botao-grande">Criar minha conta</Link>
            <Link to="/sobre" className="final-link">Entenda como o Nexo funciona</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
