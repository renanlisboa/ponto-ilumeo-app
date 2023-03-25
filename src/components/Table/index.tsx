import { memo } from 'react';

import { Spinner } from '../Spinner';
import { Pagination } from './Pagination';

import styles from './table.module.css';

type TableProps = {
  loading: boolean;
  itens: any[];
  totalItens: number;
  buscarLista: (
    pagina?: number,
    itensPorPagina?: number,
    filtro?: string,
  ) => Promise<void>;
};

export const Table = memo(function Table({
  loading,
  itens,
  totalItens,
  buscarLista,
}: TableProps) {
  return (
    <div className={styles.table}>
      <div className={styles.tableToolbar}>
        <h2 className={styles.tableTitle}>Registros anteriores</h2>
      </div>
      <div className={styles.tableBody}>
        <div className={styles.tableHead}>
          <span className={styles.tableRowText}>Data de entrada</span>
          <span className={styles.tableRowText}>Tempo</span>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          itens.map(ponto => (
            <div key={ponto.id} className={styles.tableRow}>
              <span className={styles.tableRowText}>{ponto.dataEntrada}</span>
              <strong className={styles.tableRowText}>
                {ponto.tempoTrabalhado}
              </strong>
            </div>
          ))
        )}
      </div>
      <Pagination totalItens={totalItens} buscarLista={buscarLista} />
    </div>
  );
});
