import { Spinner } from './Spinner';

import styles from './table.module.css';

type TableProps = {
  loading: boolean;
  pontos: any[];
  totalPontos: number;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  listarPontos: (pageNumber?: number) => void;
  paginacao: {
    totalPaginas: number;
    itensPorPagina: number;
    pages: Array<{
      number: number;
    }>;
    limit: number;
    offset: number;
  };
};

export function Table({
  loading,
  pontos,
  totalPontos,
  currentPage,
  setCurrentPage,
  listarPontos,
  paginacao,
}: TableProps) {
  const handleChangePage = (pageNumber: number) => {
    listarPontos(pageNumber);
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Dias anteriores</h2>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span className={styles.tableRowText}>Data de entrada</span>
          <span className={styles.tableRowText}>Tempo</span>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          pontos.map(ponto => (
            <div key={ponto.id} className={styles.tableRow}>
              <span className={styles.tableRowText}>{ponto.dataEntrada}</span>
              <strong className={styles.tableRowText}>
                {ponto.tempoTrabalhado}
              </strong>
            </div>
          ))
        )}
      </div>
      <div className={styles.tablePagination}>
        <div>
          <strong>{0}</strong> - <strong>{pontos.length}</strong> de{' '}
          <strong>{totalPontos}</strong>
        </div>
        <div className={styles.tablePageContainer}>
          {currentPage > 3 && (
            <>
              <button className={styles.tablePage}>1</button>
              <span>...</span>
            </>
          )}
          {paginacao.pages.map(
            page =>
              page.number > paginacao.limit &&
              page.number <= paginacao.offset && (
                <button
                  key={page.number}
                  className={
                    page.number == currentPage
                      ? styles.tableActivePage
                      : styles.tablePage
                  }
                  onClick={() => {
                    handleChangePage(page.number);
                  }}
                >
                  {page.number}
                </button>
              ),
          )}
          {paginacao.totalPaginas > 3 &&
            currentPage < paginacao.totalPaginas && (
              <>
                <span>...</span>
                <button
                  className={
                    totalPontos == currentPage
                      ? styles.tableActivePage
                      : styles.tablePage
                  }
                >
                  {paginacao.totalPaginas}
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
