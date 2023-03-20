import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../contexts';
import { HttpClientHelper } from '../helpers';

import '../styles/inicio.styles.css';

const httpClientHelper = new HttpClientHelper();

export function Incio() {
  const [codigoColaborador, setCodigoColaborador] = useState('');
  const { setStore } = useAppContext();
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCodigoColaborador(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = {
      codigoColaborador,
    };
    const response = await httpClientHelper.post('/acessar-pontos', body);
    if (!response) return;
    setStore(previousState => ({
      ...previousState,
      ...response,
    }));
    navigate('/pontos');
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="logomarca">
          Ponto <span className="logomarca-bold">Ilumeo</span>
        </h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label className="label" htmlFor="codigo-usuario">
              Código do usuário
            </label>
            <input
              className="input"
              type="text"
              id="codigo-usuario"
              placeholder="Digitar código"
              onChange={handleInputChange}
              value={codigoColaborador}
            />
          </div>
          <button className="submit-button" type="submit">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
