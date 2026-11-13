import './style.scss';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { candidatarVaga } from '../../services/vagaService.js';
import { mensagemDeErro } from '../../services/api.js';

export default function DetalhesVaga({ vagas, usuario }) {
  const { id } = useParams();
  const vaga = vagas.find((item) => String(item.id) === id);

  const [candidatou, setCandidatou] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  async function candidatar() {
    if (!usuario) {
      navegar('/entrar');
      return;
    }

    if (usuario.tipo !== 'candidato') {
      setErro('Somente candidatos podem se candidatar a vagas.');
      return;
    }

    setCarregando(true);
    setErro('');
    setMensagem('');

    try {
      await candidatarVaga(vaga.id);
      setCandidatou(true);
      setMensagem('Candidatura registrada com sucesso. Acompanhe o andamento no seu painel.');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível registrar sua candidatura.'));
    } finally {
      setCarregando(false);
    }
  }

  if (!vaga) {
    return (
      <section className="destaque-pagina">
        <div className="container">
          <h1>Vaga não encontrada</h1>
          <Link to="/vagas" className="botao botao-principal">
            Voltar para vagas
          </Link>
        </div>
      </section>
    );
  }

  const iniciais = vaga.empresa
    .split(' ')
    .map((palavra) => palavra.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  let textoBotao = 'Quero me candidatar';
  if (carregando) {
    textoBotao = 'Enviando...';
  } else if (candidatou) {
    textoBotao = 'Candidatura enviada';
  }

  return (
    <section className="secao">
      <div className="container colunas-detalhe">
        <div className="coluna-principal">
          <Link to="/vagas" className="voltar">
            ← Voltar para vagas
          </Link>

          <article className="cartao-detalhe">
            <div className="vaga-topo">
              <div className="empresa-logo grande">{iniciais}</div>
              <div className="vaga-titulo">
                <span className="subtitulo">{vaga.area}</span>
                <h1>{vaga.titulo}</h1>
                <p>{vaga.empresa}</p>
              </div>
            </div>

            <div className="vaga-detalhes detalhes-vaga">
              <span>{vaga.cidade}</span>
              <span>{vaga.formato}</span>
              <span>{vaga.salario || 'A combinar'}</span>
            </div>

            <h2>Sobre a oportunidade</h2>
            <p className="texto-corpo">
              {vaga.descricao || 'A empresa ainda não informou uma descrição.'}
            </p>

            <h2>Habilidades e requisitos</h2>
            <div className="lista-etiquetas">
              {vaga.habilidades.map((habilidade) => (
                <span className="etiqueta" key={habilidade}>{habilidade}</span>
              ))}
            </div>
          </article>
        </div>

        <aside className="cartao-candidatura">
          <span className="subtitulo">RESUMO DA VAGA</span>
          <div className="salario-grande">{vaga.salario || 'A combinar'}</div>
          <span className="texto-claro">Faixa salarial informada pela empresa</span>

          <ul className="lista-check">
            <li>Candidatura registrada na plataforma</li>
            <li>Acompanhe o status pelo painel</li>
          </ul>

          {mensagem && <p className="mensagem">{mensagem}</p>}
          {erro && <p className="erro">{erro}</p>}

          <button
            className="botao botao-principal largura-total"
            onClick={candidatar}
            disabled={carregando || candidatou}
          >
            {textoBotao}
          </button>
        </aside>
      </div>
    </section>
  );
}