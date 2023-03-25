import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../components/Table';
import { useAppContext } from '../contexts';
import { HttpClientHelper, DateHelper, AlertHelper } from '../helpers';

import styles from './ponto.module.css';

type PontoType = {
  id: string;
  dataEntrada: string;
  tempoTrabalhado: string;
};

type Registro = {
  id: string;
  dataEntrada: string;
  dataSaida: string;
  idColaborador: string;
};

let pontoAberto = false;

export function Ponto() {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrarPontoLoading, setRegistrarPontoLoading] = useState(false);
  const [tempoTrabalhado, setTempoTrabalhado] = useState('0h 00m');
  const [ponto, setPonto] = useState<Registro | null>(null);
  const [pontos, setPontos] = useState<PontoType[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  const { store, removeUserData } = useAppContext();
  const httpClientHelper = new HttpClientHelper();
  const dateHelper = new DateHelper();
  const alertHelper = new AlertHelper();

  useEffect(() => {
    if (!store.colaborador) return;
    buscarPontoEntrada();
    listarPontos();
  }, []);

  function atualizarTempo() {
    if (!eventSource) return;
    eventSource.onmessage = function (event) {
      if (!pontoAberto) {
        setTempoTrabalhado('0h 00m');
        setPonto(null);
        eventSource.close();
        setEventSource(null);
      } else {
        const data = JSON.parse(event.data);
        setPonto(data);
        const dataAtual = new Date();
        const dataEntrada = new Date(data.dataEntrada);
        const diferencaEntreDatas = dateHelper.getTimeDifferenceBetweenDates(
          dataAtual,
          dataEntrada,
        );
        const tempoTrabalhadoFormatado =
          dateHelper.formatHour(diferencaEntreDatas);
        setTempoTrabalhado(tempoTrabalhadoFormatado);
      }
    };
    eventSource.onerror = function (error) {
      console.error(error);
      eventSource.close();
    };
  }

  atualizarTempo();

  const buscarPontoEntrada = async () => {
    const data = await httpClientHelper.get('/buscar-ponto', {
      idColaborador: store.colaborador?.id,
    });
    if (!data) return;
    pontoAberto = true;
    if (!eventSource) {
      setEventSource(
        new EventSource(
          `${import.meta.env.VITE_API_URL}/stream?idColaborador=${
            store.colaborador?.id
          }`,
        ),
      );
    }
    setPonto(data);
    const dataAtual = new Date();
    const dataEntrada = new Date(data.dataEntrada);
    const diferencaEntreDatas = dateHelper.getTimeDifferenceBetweenDates(
      dataAtual,
      dataEntrada,
    );
    const tempoTrabalhadoFormatado = dateHelper.formatHour(diferencaEntreDatas);
    setTempoTrabalhado(tempoTrabalhadoFormatado);
  };

  const listarPontos = useCallback(
    async (pagina?: number, itensPorPagina?: number) => {
      const queryParams = {
        idColaborador: store.colaborador?.id,
      };
      if (pagina) Object.assign(queryParams, { pagina });
      if (itensPorPagina) Object.assign(queryParams, { itensPorPagina });
      setLoading(true);
      const response = await httpClientHelper.get(
        '/listar-pontos',
        queryParams,
      );
      setLoading(false);
      if (!response) return;
      setPontos(() =>
        response.registros.map((registro: any) => {
          const dataEntrada = new Date(registro.dataEntrada);
          const dataSaida = new Date(registro.dataSaida);
          const diferencaEntreDatas = dateHelper.getTimeDifferenceBetweenDates(
            dataSaida,
            dataEntrada,
          );
          const tempoTrabalhadoFormatado =
            dateHelper.formatHour(diferencaEntreDatas);
          return {
            id: registro.id,
            dataEntrada: dateHelper.formatDate(dataEntrada),
            tempoTrabalhado: tempoTrabalhadoFormatado,
          };
        }),
      );
      setTotalPontos(response.totalRegistros);
    },
    [],
  );

  const handleRegistrarEntrada = async () => {
    setRegistrarPontoLoading(true);
    await httpClientHelper.post('/registrar-entrada', {
      idColaborador: store.colaborador?.id,
    });
    setRegistrarPontoLoading(false);
    alertHelper.success('Entrada registrada com sucesso');
    buscarPontoEntrada();
  };

  const handleRegistrarSaida = async () => {
    if (!ponto) return;
    setRegistrarPontoLoading(true);
    await httpClientHelper.put('/registrar-saida', ponto.id, {
      dataSaida: new Date(),
    });
    setRegistrarPontoLoading(false);
    alertHelper.success('Saída registrada com sucesso');
    setPonto(null);
    setTempoTrabalhado('0h 00m');
    listarPontos();
    if (eventSource) eventSource.close();
    setEventSource(null);
    pontoAberto = false;
  };

  const handleSair = () => {
    if (eventSource) eventSource.close();
    setEventSource(null);
    removeUserData();
    pontoAberto = false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Relógio de ponto</h2>
          <div className={styles.colaboradorInfo}>
            <strong>{store.colaborador?.codigo}</strong>
            <small className={styles.colaboradorDescricao}>Usuário</small>
          </div>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.tempoContainer}>
            <strong className={styles.tempo}>{tempoTrabalhado}</strong>
            <small className={styles.tempoDescricao}>Horas de hoje</small>
          </div>
          <Link onClick={handleSair} to="/">
            Sair
          </Link>
        </div>
        {ponto ? (
          <button className={styles.pontoButton} onClick={handleRegistrarSaida}>
            {registrarPontoLoading ? 'Registrando...' : 'Registrar saída'}
          </button>
        ) : (
          <button
            className={styles.pontoButton}
            onClick={handleRegistrarEntrada}
          >
            {registrarPontoLoading ? 'Registrando...' : 'Registrar entrada'}
          </button>
        )}
        <Table
          loading={loading}
          itens={pontos}
          buscarLista={listarPontos}
          totalItens={totalPontos}
        />
      </div>
    </div>
  );
}
