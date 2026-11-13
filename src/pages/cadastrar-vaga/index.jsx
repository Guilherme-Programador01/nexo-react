import './style.scss';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mensagemDeErro } from '../../services/api.js';
import { AREAS, FORMATOS } from '../../constantes.js';

export default function CadastrarVaga({ usuario, aoAdicionarVaga }) {
  const navegar = useNavigate();

  // se a área da empresa estiver na lista, já deixa selecionada
  let areaInicial = 'Tecnologia';
  if (AREAS.includes(usuario.area)) {
    areaInicial = usuario.area;
  }

  const [form, setForm] = useState({
    titulo: '',
    cidade: '',
    formato: 'Híbrido',
    area: areaInicial,
    salario: '',
    descricao: '',
    habilidades: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // atualiza o campo que a pessoa está digitando (usa o "name" do campo)
  function alterar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    // as habilidades são digitadas separadas por vírgula; viram uma lista
    const listaHabilidades = form.habilidades
      .split(',')
      .map(function (item) { return item.trim(); })
      .filter(function (item) { return item !== ''; });

    try {
      await aoAdicionarVaga({ ...form, habilidades: listaHabilidades });
      navegar('/empresa');
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível publicar a vaga.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <section className="destaque-pagina">
        <div className="container">
          <span className="subtitulo">ÁREA DA EMPRESA</span>
          <h1>Divulgue uma oportunidade</h1>
          <p>Preencha as informações para apresentar sua vaga aos talentos da plataforma.</p>
        </div>
      </section>

      <section className="secao">
        <div className="container pagina-formulario">
          <form className="formulario-grande" onSubmit={enviar}>
            <div className="titulo-formulario">
              <span className="icone-etapa">1</span>
              <div>
                <h2>Informações da vaga</h2>
                <p>Preencha todos os campos obrigatórios (*).</p>
              </div>
            </div>

            <div className="campos-formulario">
              <label>
                Título da vaga *
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={alterar}
                  required
                  placeholder="Ex.: Assistente administrativo"
                />
              </label>

              <label>
                Nome da empresa
                <input value={usuario.nome} readOnly />
              </label>

              <label>
                Localidade *
                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={alterar}
                  required
                  placeholder="Cidade, UF ou remoto"
                />
              </label>

              <label>
                Área profissional
                <select name="area" value={form.area} onChange={alterar}>
                  {AREAS.map(function (item) {
                    return <option key={item}>{item}</option>;
                  })}
                </select>
              </label>

              <label>
                Formato de trabalho
                <select name="formato" value={form.formato} onChange={alterar}>
                  {FORMATOS.map(function (item) {
                    return <option key={item}>{item}</option>;
                  })}
                </select>
              </label>

              <label>
                Faixa salarial
                <input
                  name="salario"
                  value={form.salario}
                  onChange={alterar}
                  placeholder="Ex.: R$ 2.500 – R$ 3.000"
                />
              </label>

              <label className="largura-total">
                Habilidades desejadas *
                <input
                  name="habilidades"
                  value={form.habilidades}
                  onChange={alterar}
                  required
                  placeholder="Separe por vírgulas: comunicação, Excel, organização"
                />
              </label>

              <label className="largura-total">
                Descrição da vaga *
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={alterar}
                  required
                  rows="5"
                  placeholder="Descreva responsabilidades, requisitos e benefícios."
                />
              </label>
            </div>

            {erro && <p className="erro">{erro}</p>}

            <div className="acoes-formulario">
              <Link to="/empresa" className="botao botao-claro">
                Cancelar
              </Link>
              <button className="botao botao-principal botao-grande" disabled={carregando}>
                {carregando ? 'Publicando...' : 'Publicar vaga'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
