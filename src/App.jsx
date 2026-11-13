import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Header from './components/Header/index.jsx';
import Footer from './components/Footer/index.jsx';

import Inicio from './pages/inicio/index.jsx';
import Vagas from './pages/vagas/index.jsx';
import DetalhesVaga from './pages/detalhes-vaga/index.jsx';
import Cadastro from './pages/cadastro/index.jsx';
import Login from './pages/login/index.jsx';
import Empresas from './pages/empresas/index.jsx';
import BuscaEmpresas from './pages/busca-empresas/index.jsx';
import CadastrarVaga from './pages/cadastrar-vaga/index.jsx';
import Sobre from './pages/sobre/index.jsx';
import PainelCandidato from './pages/painel-candidato/index.jsx';
import PainelEmpresa from './pages/painel-empresa/index.jsx';
import BancoCurriculos from './pages/curriculos/index.jsx';
import MeuCurriculo from './pages/meu-curriculo/index.jsx';

import { salvarToken, limparToken } from './services/api.js';
import { cadastrarConta, fazerLogin, buscarPerfil } from './services/authService.js';
import { listarVagas, criarVaga, excluirVaga } from './services/vagaService.js';
import { vagasDemo } from './dadosDemo.js';

// Estrutura que se repete em todas as páginas: menu, conteúdo e rodapé
function Layout({ usuario, aoSair }) {
  return (
    <>
      <Header usuario={usuario} aoSair={aoSair} />
      <main className="conteudo-principal">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Só deixa entrar se a pessoa estiver logada (e for do tipo certo)
function RotaProtegida({ usuario, tipo, children }) {
  if (!usuario) {
    return <Navigate to="/entrar" replace />;
  }

  if (usuario.tipo !== tipo) {
    // está logada, mas é do outro tipo: manda para o painel dela
    return <Navigate to={usuario.tipo === 'empresa' ? '/empresa' : '/candidato'} replace />;
  }

  return children;
}

export default function App() {
  // lista de vagas do site (começa com as vagas de exemplo)
  const [vagas, setVagas] = useState(vagasDemo);
  const [vagasSaoDemo, setVagasSaoDemo] = useState(true);
  // pessoa logada (null = ninguém logado)
  const [usuario, setUsuario] = useState(null);

  // quando o site abre, busca as vagas na API
  useEffect(function () {
    async function carregarVagas() {
      try {
        const lista = await listarVagas();
        setVagas(lista);
        setVagasSaoDemo(false);
      } catch (erro) {
        // sem API, o site continua mostrando as vagas de exemplo (sem aviso de erro na tela)
      }
    }

    carregarVagas();
  }, []);

  async function entrar(email, senha) {
    const dados = await fazerLogin(email, senha);
    salvarToken(dados.token);

    const perfil = await buscarPerfil();
    setUsuario(perfil);
    return perfil;
  }

  async function cadastrar(conta) {
    await cadastrarConta(conta);
    return entrar(conta.email, conta.senha);
  }

  function sair() {
    limparToken();
    setUsuario(null);
  }

  async function adicionarVaga(vaga) {
    const novaVaga = await criarVaga(vaga);
    setVagas([novaVaga, ...vagas]);
  }

  async function removerVaga(id) {
    await excluirVaga(id);
    setVagas(vagas.filter(function (vaga) { return vaga.id !== id; }));
  }

  return (
    <Routes>
      <Route element={<Layout usuario={usuario} aoSair={sair} />}>
        {/* Páginas abertas para todo mundo */}
        <Route path="/" element={<Inicio vagas={vagas} vagasSaoDemo={vagasSaoDemo} />} />
        <Route path="/vagas" element={<Vagas vagas={vagas} vagasSaoDemo={vagasSaoDemo} />} />
        <Route path="/vagas/:id" element={<DetalhesVaga vagas={vagas} usuario={usuario} />} />
        <Route path="/empresas" element={<BuscaEmpresas />} />
        <Route path="/para-empresas" element={<Empresas />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/entrar" element={<Login aoEntrar={entrar} />} />
        <Route path="/cadastro" element={<Cadastro aoCadastrar={cadastrar} />} />

        {/* Páginas do candidato */}
        <Route
          path="/candidato"
          element={
            <RotaProtegida usuario={usuario} tipo="candidato">
              <PainelCandidato usuario={usuario} vagas={vagas} />
            </RotaProtegida>
          }
        />
        <Route
          path="/meu-curriculo"
          element={
            <RotaProtegida usuario={usuario} tipo="candidato">
              <MeuCurriculo usuario={usuario} aoAtualizarUsuario={setUsuario} />
            </RotaProtegida>
          }
        />

        {/* Páginas da empresa */}
        <Route
          path="/empresa"
          element={
            <RotaProtegida usuario={usuario} tipo="empresa">
              <PainelEmpresa usuario={usuario} aoExcluirVaga={removerVaga} aoSair={sair} />
            </RotaProtegida>
          }
        />
        <Route
          path="/cadastrar-vaga"
          element={
            <RotaProtegida usuario={usuario} tipo="empresa">
              <CadastrarVaga usuario={usuario} aoAdicionarVaga={adicionarVaga} />
            </RotaProtegida>
          }
        />
        <Route
          path="/curriculos"
          element={
            <RotaProtegida usuario={usuario} tipo="empresa">
              <BancoCurriculos usuario={usuario} />
            </RotaProtegida>
          }
        />

        {/* Qualquer outro endereço */}
        <Route
          path="*"
          element={
            <section className="destaque-pagina">
              <div className="container">
                <h1>Página não encontrada</h1>
                <p>Confira o endereço ou volte para o início.</p>
              </div>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
