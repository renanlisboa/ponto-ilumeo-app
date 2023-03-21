import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../contexts';
import { HttpClientHelper } from '../helpers';

import styles from './inicio.module.css';

const httpClientHelper = new HttpClientHelper();

export function Incio() {
  const [loading, setLoading] = useState(false);
  const [codigoColaborador, setCodigoColaborador] = useState('');
  const { saveToStore } = useAppContext();
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCodigoColaborador(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = {
      codigoColaborador,
    };
    setLoading(true);
    const response = await httpClientHelper.post('/acessar-pontos', body);
    setLoading(false);
    if (!response) return;
    saveToStore({
      colaborador: response.colaborador,
    });
    navigate('/pontos');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.logomarca}>
          Ponto <span className={styles.logomarcaBold}>Ilumeo</span>
        </h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="codigo-usuario">
              Código do usuário
            </label>
            <input
              className={styles.input}
              type="text"
              id="codigo-usuario"
              placeholder="Digitar código"
              onChange={handleInputChange}
              value={codigoColaborador}
            />
          </div>
          <button className={styles.submitButton} type="submit">
            {loading ? 'Carregando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
}
