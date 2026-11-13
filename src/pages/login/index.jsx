import './style.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mensagemDeErro } from '../../services/api.js';

// Perfis que podem entrar. Cada aba muda os textos e o tipo de documento aceito.
const PERFIS = {
  candidato: { rotulo: 'Sou Candidato', documento: 'CPF', tamanho: 11 },
  empresa: { rotulo: 'Sou Empresa / Administrador', documento: 'CNPJ', tamanho: 14 }
};

function lerIdentificadorSalvo() {
  try {
    return localStorage.getItem('nexo-identificador') || '';
  } catch (erro) {
    return ''; // navegador sem armazenamento: segue sem lembrar
  }
}

function guardarIdentificador(valor) {
  try {
    if (valor) localStorage.setItem('nexo-identificador', valor);
    else localStorage.removeItem('nexo-identificador');
  } catch (erro) {
    // sem armazenamento: ignora
  }
}

// Deixa só os números de um texto (ex.: "123.456.789-00" -> "12345678900")
function soNumeros(texto) {
  return texto.replace(/\D/g, '');
}

// Confere os campos e devolve um objeto com as mensagens de erro (vazio = tudo certo)
function validar(perfil, identificador, senha) {
  const erros = {};
  const texto = identificador.trim();

  if (!texto) {
    erros.identificador = 'Informe seu e-mail ou ' + PERFIS[perfil].documento + '.';
  } else if (texto.includes('@')) {
    if (!/^\S+@\S+\.\S+$/.test(texto)) {
      erros.identificador = 'Digite um e-mail válido, como voce@email.com.';
    }
  } else if (soNumeros(texto).length !== PERFIS[perfil].tamanho) {
    erros.identificador = PERFIS[perfil].documento + ' deve ter ' + PERFIS[perfil].tamanho + ' números.';
  }

  if (!senha) {
    erros.senha = 'Informe sua senha.';
  } else if (senha.length < 6) {
    erros.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  }

  return erros;
}

export default function Login({ aoEntrar }) {
  const [perfil, setPerfil] = useState('candidato');
  // "Lembrar-me": guarda só o identificador (nunca a senha) neste navegador
  const salvo = lerIdentificadorSalvo();
  const [identificador, setIdentificador] = useState(salvo);
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(Boolean(salvo));
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({}); // campos que a pessoa já preencheu/saiu
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  // Troca de aba: limpa erros para começar do zero
  function trocarPerfil(novo) {
    setPerfil(novo);
    setErros({});
    setTocados({});
    setErroApi('');
  }

  // Valida um campo quando a pessoa sai dele (onBlur)
  function aoSairDoCampo(campo) {
    setTocados({ ...tocados, [campo]: true });
    setErros(validar(perfil, identificador, senha));
  }

  // Define a classe visual do campo: roxo no foco (CSS), vermelho com erro, verde quando está certo
  function classeDoCampo(campo, valor) {
    if (!tocados[campo]) return '';
    if (erros[campo]) return 'campo-erro';
    return valor ? 'campo-ok' : '';
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErroApi('');

    const novosErros = validar(perfil, identificador, senha);
    setErros(novosErros);
    setTocados({ identificador: true, senha: true });
    if (Object.keys(novosErros).length > 0) return;

    // se não for e-mail, envia só os números do CPF/CNPJ
    const texto = identificador.trim();
    const login = texto.includes('@') ? texto.toLowerCase() : soNumeros(texto);

    setCarregando(true);
    try {
      const conta = await aoEntrar(login, senha);
      guardarIdentificador(lembrar ? identificador.trim() : '');
      // cada tipo de conta vai para o seu painel
      navegar(conta.tipo === 'empresa' ? '/empresa' : '/candidato');
    } catch (erro) {
      setErroApi(mensagemDeErro(erro, 'Não foi possível entrar. Confira seus dados e tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="pagina-acesso">
      <form className="formulario login" onSubmit={enviar} noValidate>
        <p className="subtitulo">NEXO PROFISSIONAL</p>
        <h1>Bem-vindo de volta!</h1>
        <p>Entre para acessar seu espaço.</p>

        {/* Abas: candidato ou empresa */}
        <div className="login-abas" role="tablist" aria-label="Tipo de acesso">
          {Object.keys(PERFIS).map(function (chave) {
            return (
              <button
                key={chave}
                type="button"
                role="tab"
                aria-selected={perfil === chave}
                className={perfil === chave ? 'aba-ativa' : ''}
                onClick={function () { trocarPerfil(chave); }}
              >
                {PERFIS[chave].rotulo}
              </button>
            );
          })}
        </div>

        <label>
          E-mail ou {PERFIS[perfil].documento}
          <input
            type="text"
            autoComplete="username"
            className={classeDoCampo('identificador', identificador)}
            value={identificador}
            onChange={function (e) { setIdentificador(e.target.value); }}
            onBlur={function () { aoSairDoCampo('identificador'); }}
            placeholder={perfil === 'empresa' ? 'rh@empresa.com ou CNPJ' : 'voce@email.com ou CPF'}
            aria-invalid={Boolean(tocados.identificador && erros.identificador)}
          />
          {tocados.identificador && erros.identificador && (
            <span className="mensagem-campo">{erros.identificador}</span>
          )}
        </label>

        <label>
          Senha
          <div className="campo-senha">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              autoComplete="current-password"
              className={classeDoCampo('senha', senha)}
              value={senha}
              onChange={function (e) { setSenha(e.target.value); }}
              onBlur={function () { aoSairDoCampo('senha'); }}
              placeholder="Sua senha"
              aria-invalid={Boolean(tocados.senha && erros.senha)}
            />
            <button
              type="button"
              className="botao-olho"
              onClick={function () { setMostrarSenha(!mostrarSenha); }}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {tocados.senha && erros.senha && <span className="mensagem-campo">{erros.senha}</span>}
        </label>

        <div className="login-opcoes">
          <label className="lembrar">
            <input type="checkbox" checked={lembrar} onChange={function (e) { setLembrar(e.target.checked); }} />
            Lembrar-me
          </label>
          <Link to="/entrar" onClick={function (e) { e.preventDefault(); }}>Esqueceu a senha?</Link>
        </div>

        {erroApi && <p className="erro" role="alert">{erroApi}</p>}

        <button className="botao botao-principal botao-grande largura-total" type="submit" disabled={carregando}>
          {carregando && <span className="spinner" aria-hidden="true" />}
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="link-ajuda">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </section>
  );
}
