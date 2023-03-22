import { useState, useEffect } from 'react';

import { Table } from '../components/Table';
import { useAppContext } from '../contexts';
import { HttpClientHelper, DateHelper, AlertHelper } from '../helpers';

import styles from './ponto.module.css';

type Pages = Array<{
  number: number;
}>;

type Paginacao = {
  totalPaginas: number;
  itensPorPagina: number;
  pages: Pages;
  limit: number;
  offset: number;
};

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

type ListarPontosResponseType = {
  totalRegistros: number;
  registros: Registro[];
};

export function Ponto() {
  const [loading, setLoading] = useState(false);
  const [tempoTrabalhado, setTempoTrabalhado] = useState('0h 00m');
  const [ponto, setPonto] = useState<Registro | null>(null);
  const [pontos, setPontos] = useState<PontoType[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    totalPaginas: 1,
    itensPorPagina: 8,
    pages: [],
    limit: 3,
    offset: 3,
  });
  const { store } = useAppContext();
  const httpClientHelper = new HttpClientHelper();
  const dateHelper = new DateHelper();
  const alertHelper = new AlertHelper();

  useEffect(() => {
    if (!store.colaborador) return;
    buscarPontoEntrada();
    listarPontos();
  }, [store.colaborador]);

  const buscarPontoEntrada = async () => {
    setLoading(true);
    const response = await httpClientHelper.get('/buscar-ponto', {
      idColaborador: store.colaborador?.id,
    });
    setLoading(false);
    if (!response) return;
    setPonto(response);
    const dataAtual = new Date();
    const dataEntrada = new Date(response.dataEntrada);
    const diferencaEntreDatas = dateHelper.getTimeDifferenceBetweenDates(
      dataAtual,
      dataEntrada,
    );
    const tempoTrabalhadoFormatado = dateHelper.formatHour(diferencaEntreDatas);
    setTempoTrabalhado(tempoTrabalhadoFormatado);
  };

  const listarPontos = async (
    pagina?: number,
  ): Promise<ListarPontosResponseType | void> => {
    setLoading(true);
    const response = await httpClientHelper.get('/listar-pontos', {
      pagina,
      itensPorPagina: paginacao.itensPorPagina,
      idColaborador: store.colaborador?.id,
    });
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
    gerarPaginacao(response.totalRegistros);
  };

  const handleRegistrarEntrada = async () => {
    setLoading(true);
    await httpClientHelper.post('/registrar-entrada', {
      idColaborador: store.colaborador?.id,
    });
    setLoading(false);
    alertHelper.success('Entrada registrada com sucesso');
    buscarPontoEntrada();
  };

  const handleRegistrarSaida = async () => {
    if (!ponto) return;
    setLoading(true);
    await httpClientHelper.put('/registrar-saida', ponto.id, {
      dataSaida: new Date(),
    });
    setLoading(false);
    alertHelper.success('Saída registrada com sucesso');
    setPonto(null);
    setTempoTrabalhado('0h 00m');
    listarPontos();
  };

  const gerarPaginacao = (totalRegistros: number) => {
    const pages = [] as Pages;
    const totalPaginas = Math.ceil(totalRegistros / paginacao.itensPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
      pages.push({
        number: i,
      });
    }
    setPaginacao(previousState => ({
      ...previousState,
      totalPaginas,
      pages,
      limit:
        currentPage > previousState.offset
          ? previousState.limit
          : currentPage - 3,
      offset:
        currentPage > previousState.offset ? currentPage : previousState.offset,
    }));
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
        <div className={styles.tempoContainer}>
          <strong className={styles.tempo}>{tempoTrabalhado}</strong>
          <small className={styles.tempoDescricao}>Horas de hoje</small>
        </div>
        {ponto ? (
          <button className={styles.pontoButton} onClick={handleRegistrarSaida}>
            {loading ? 'Registrando' : 'Registrar saída'}
          </button>
        ) : (
          <button
            className={styles.pontoButton}
            onClick={handleRegistrarEntrada}
          >
            {loading ? 'Registrando' : 'Registrar entrada'}
          </button>
        )}
        <Table
          loading={loading}
          pontos={pontos}
          totalPontos={totalPontos}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          listarPontos={listarPontos}
          paginacao={paginacao}
        />
      </div>
    </div>
  );
}
