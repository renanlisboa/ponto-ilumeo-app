import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../contexts';
import { HttpClientHelper, AlertHelper } from '../helpers';
import { AcessarPontosValidator } from '../validators';

import styles from './inicio.module.css';

const httpClientHelper = new HttpClientHelper();

export function Incio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { saveToStore } = useAppContext();
  const navigate = useNavigate();
  const acessarPontosValidator = new AcessarPontosValidator();
  const alertHelper = new AlertHelper();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formEntries = Object.fromEntries(formData.entries());
    try {
      const dadosValidados = acessarPontosValidator.validate(formEntries);
      setLoading(true);
      const response = await httpClientHelper.post(
        '/acessar-pontos',
        dadosValidados,
      );
      setLoading(false);
      if (!response)
        throw new Error(
          'Erro ao acessar ponto. Verifique seus dados e tente novamente',
        );
      saveToStore({
        colaborador: response.colaborador,
      });
      navigate('/pontos');
    } catch (error: any) {
      setError(true);
      if (error.name == 'ZodError') {
        alertHelper.error('Código deve ter entre 1 e 20 caracteres');
      }
    }
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
              className={error ? styles.inputError : styles.input}
              type="text"
              id="codigo-usuario"
              name="codigoColaborador"
              placeholder="Digitar código"
              onChange={() => {
                setError(false);
              }}
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
