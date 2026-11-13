import './style.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mensagemDeErro } from '../../services/api.js';
import { AREAS } from '../../constantes.js';

export default function Cadastro({ aoCadastrar }) {
  const [tipo, setTipo] = useState('candidato');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    const formulario = evento.target;

    const conta = {
      nome: formulario.nome.value.trim(),
      email: formulario.email.value.trim().toLowerCase(),
      senha: formulario.senha.value,
      area: formulario.area.value,
      tipo
    };

    if (tipo === 'candidato') {
      conta.experiencia = formulario.experiencia.value.trim();
      conta.habilidades = formulario.habilidades.value.trim();
      conta.escolaridade = formulario.escolaridade.value.trim();
    } else {
      conta.cidade = formulario.cidade.value.trim();
      conta.estado = formulario.estado.value.trim();
      conta.descricao = formulario.descricao.value.trim();
    }

    try {
      await aoCadastrar(conta);
      navegar(tipo === 'empresa' ? '/empresa' : '/candidato');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível criar a conta.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="pagina-acesso">
      <form className="formulario" onSubmit={enviar}>
        <p className="subtitulo">NEXO</p>
        <h1>Crie sua conta</h1>
        <p>Escolha como você vai usar a plataforma.</p>

        <div className="escolha">
          <button
            type="button"
            className={tipo === 'candidato' ? 'selecionado' : ''}
            onClick={() => setTipo('candidato')}
          >
            Sou candidato
          </button>
          <button
            type="button"
            className={tipo === 'empresa' ? 'selecionado' : ''}
            onClick={() => setTipo('empresa')}
          >
            Sou empresa
          </button>
        </div>

        <label>
          {tipo === 'empresa' ? 'Nome da empresa' : 'Nome completo'}
          <input
            name="nome"
            required
            placeholder={tipo === 'empresa' ? 'Ex.: Empresa ABC' : 'Digite seu nome'}
          />
        </label>

        <label>
          E-mail
          <input name="email" type="email" required placeholder="voce@email.com" />
        </label>

        <label>
          Senha
          <input
            name="senha"
            type="password"
            minLength="8"
            required
            placeholder="Mínimo de 8 caracteres"
          />
        </label>

        <label>
          {tipo === 'empresa' ? 'Área da empresa' : 'Área de interesse'}
          <select name="area" required defaultValue="">
            <option value="" disabled>Escolha uma área</option>
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </label>

        {tipo === 'empresa' && (
          <>
            <label>
              Cidade
              <input name="cidade" placeholder="Ex.: Campinas" />
            </label>
            <label>
              Estado
              <input name="estado" placeholder="Ex.: SP" />
            </label>
            <label>
              Sobre a empresa
              <textarea name="descricao" rows="3" placeholder="Conte um pouco sobre a empresa." />
            </label>
          </>
        )}

        {tipo === 'candidato' && (
          <>
            <label>
              Experiência profissional (opcional)
              <input name="experiencia" placeholder="Ex.: atendimento ao cliente" />
            </label>
            <label>
              Habilidades (opcional)
              <input name="habilidades" placeholder="Ex.: Excel, comunicação, organização" />
            </label>
            <label>
              Escolaridade (opcional)
              <input name="escolaridade" placeholder="Ex.: Ensino médio completo" />
            </label>
          </>
        )}

        {erro && <p className="erro">{erro}</p>}

        <button className="botao-principal" type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Criar conta'}
        </button>

        <p className="link-ajuda">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </section>
  );
}