import './style.scss';
import { useState } from 'react';
import { atualizarPerfil, enviarArquivoCurriculo } from '../../services/authService.js';
import { mensagemDeErro, urlDoServidor } from '../../services/api.js';

export default function MeuCurriculo({ usuario, aoAtualizarUsuario }) {
  const [form, setForm] = useState({
    nome: usuario.nome || '',
    area: usuario.area || '',
    telefone: usuario.telefone || '',
    cidade: usuario.cidade || '',
    resumo: usuario.resumo || '',
    experiencia: usuario.experiencia || '',
    escolaridade: usuario.escolaridade || '',
    habilidades: usuario.habilidades || ''
  });

  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [dataEnvio, setDataEnvio] = useState('');

  function alterar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErro('');
    setMensagem('');
    setSalvando(true);

    try {
      const perfil = await atualizarPerfil(form);
      aoAtualizarUsuario(perfil);
      setMensagem('Seu currículo foi salvo no Nexo.');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível salvar seu currículo.'));
    } finally {
      setSalvando(false);
    }
  }

  async function enviarArquivo(evento) {
    evento.preventDefault();

    if (!arquivo) {
      setErro('Selecione um arquivo PDF, DOC ou DOCX.');
      return;
    }

    setErro('');
    setMensagem('');
    setEnviando(true);

    try {
      const resultado = await enviarArquivoCurriculo(arquivo);
      aoAtualizarUsuario(resultado.perfil);
      setMensagem('Arquivo enviado com sucesso.');
      setDataEnvio(new Date().toLocaleString('pt-BR'));
      setArquivo(null);
      evento.target.reset();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível enviar o arquivo.'));
    } finally {
      setEnviando(false);
    }
  }

  const urlCurriculo = usuario.curriculo_url ? urlDoServidor + usuario.curriculo_url : '';

  return (
    <section className="meu-curriculo-pagina">
      <div className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">ÁREA DO CANDIDATO</span>
          <h1>Apresente seu potencial.</h1>
          <p>
            Crie um perfil profissional completo para que as empresas encontrem
            suas habilidades e experiência.
          </p>
        </div>
      </div>

      <div className="container curriculo-layout">
        <form className="formulario-curriculo" onSubmit={salvar}>
          <div className="titulo-curriculo">
            <span>01</span>
            <div>
              <h2>Monte seu currículo</h2>
              <p>As informações serão salvas no seu perfil do Nexo.</p>
            </div>
          </div>

          <div className="campos-curriculo">
            <label>
              Nome completo
              <input name="nome" value={form.nome} onChange={alterar} required />
            </label>
            <label>
              Área profissional
              <input name="area" value={form.area} onChange={alterar} required />
            </label>
            <label>
              Telefone
              <input name="telefone" value={form.telefone} onChange={alterar} placeholder="(11) 99999-9999" />
            </label>
            <label>
              Cidade
              <input name="cidade" value={form.cidade} onChange={alterar} placeholder="Cidade, UF" />
            </label>
            <label className="campo-largo">
              Objetivo profissional e resumo
              <textarea
                name="resumo"
                value={form.resumo}
                onChange={alterar}
                rows="4"
                placeholder="Apresente-se em poucas linhas: seus objetivos, pontos fortes e área de interesse."
              />
            </label>
            <label className="campo-largo">
              Experiência profissional
              <textarea
                name="experiencia"
                value={form.experiencia}
                onChange={alterar}
                rows="4"
                placeholder="Descreva suas atividades, responsabilidades, estágios ou projetos."
              />
            </label>
            <label>
              Formação e cursos
              <input
                name="escolaridade"
                value={form.escolaridade}
                onChange={alterar}
                placeholder="Ex.: Técnico em Desenvolvimento de Sistemas"
              />
            </label>
            <label>
              Principais habilidades
              <input
                name="habilidades"
                value={form.habilidades}
                onChange={alterar}
                placeholder="JavaScript, Excel, comunicação..."
              />
            </label>
          </div>

          {erro && <p className="erro">{erro}</p>}
          {mensagem && <p className="mensagem-curriculo">{mensagem}</p>}

          <button className="botao botao-principal botao-grande" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar currículo'}
          </button>
          <section className="previa-curriculo" aria-label="Pré-visualização do currículo">
            <div className="previa-cabecalho"><span>PRÉ-VISUALIZAÇÃO</span><small>Atualizada conforme você preenche os campos</small></div>
            <div className="previa-identificacao">
              <div className="previa-avatar">{(form.nome || 'C').trim().charAt(0).toUpperCase()}</div>
              <div><h2>{form.nome || 'Seu nome completo'}</h2><p>{form.area || 'Sua área profissional'}</p><small>{[form.cidade, form.telefone].filter(Boolean).join(' · ') || 'Cidade e telefone'}</small></div>
            </div>
            <div className="previa-bloco"><h3>Resumo profissional</h3><p>{form.resumo || 'Seu objetivo profissional e resumo aparecerão aqui.'}</p></div>
            <div className="previa-bloco"><h3>Experiência</h3><p>{form.experiencia || 'Adicione suas experiências, estágios ou projetos.'}</p></div>
            <div className="previa-bloco"><h3>Formação</h3><p>{form.escolaridade || 'Sua formação e cursos aparecerão aqui.'}</p></div>
            <div className="previa-bloco"><h3>Habilidades</h3><div className="previa-habilidades">
              {(form.habilidades || '').split(',').map((item) => item.trim()).filter(Boolean).map((item, indice) => <span key={`${item}-${indice}`}>{item}</span>)}
              {!form.habilidades && <small>Suas principais habilidades</small>}
            </div></div>
          </section>
        </form>

        <aside className="envio-curriculo">
          <div className="titulo-curriculo">
            <span>02</span>
            <div>
              <h2>Enviar arquivo</h2>
              <p>Já tem um currículo pronto? Anexe aqui.</p>
            </div>
          </div>

          <form onSubmit={enviarArquivo}>
            <label className="zona-arquivo">
              <strong>Selecione seu currículo</strong>
              <span>PDF, DOC ou DOCX · máximo de 5 MB</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setArquivo(e.target.files[0] || null)}
              />
            </label>

            {arquivo && <p className="arquivo-selecionado">{arquivo.name}</p>}

            <button className="botao botao-secundario botao-grande" type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar currículo'}
            </button>
          </form>

          {urlCurriculo && (
            <div className="curriculo-enviado">
              <strong>Arquivo enviado</strong>
              <p>Seu currículo está associado ao perfil.</p>
              <small>{dataEnvio ? `Enviado em ${dataEnvio}` : 'Arquivo já disponível no seu perfil'}</small>
              <a href={urlCurriculo} target="_blank" rel="noreferrer">
                Abrir currículo enviado
              </a>
            </div>
          )}

          <div className="dica-curriculo">
            <strong>Dica</strong>
            <p>
              Um bom currículo destaca experiências, formação e habilidades
              relevantes para as vagas que você procura.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}