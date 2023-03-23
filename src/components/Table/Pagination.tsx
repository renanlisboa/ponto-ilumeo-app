import { useEffect, useState } from 'react';
import styles from './pagination.module.css';

type PaginationProps = {
  totalItens: number;
  buscarLista: (pagina?: number, itensPorPagina?: number) => Promise<void>;
};

export function Pagination({ totalItens, buscarLista }: PaginationProps) {
  const paginaInicial = 1;
  const itensPorPagina = 8;
  const [paginaAtual, setPaginalAtual] = useState(paginaInicial);
  const totalPaginas = Math.ceil(totalItens / itensPorPagina);
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina + 1;
  const paginaAnterior =
    paginaAtual == paginaInicial ? paginaInicial : paginaAtual - 1;
  const paginaSeguinte = paginaAtual == paginaInicial ? 3 + 1 : paginaAtual + 2;
  const numerosPagina = [...Array(totalPaginas + 1).keys()].slice(
    paginaAnterior,
    paginaSeguinte,
  );

  useEffect(() => {
    setPaginalAtual(paginaInicial);
  }, [totalItens]);

  const handleIrParaPaginaAnterior = () => {
    if (paginaAtual != 1) {
      setPaginalAtual(paginaAtual - 1);
      buscarLista(paginaAtual - 1, itensPorPagina);
    }
  };

  const handleAlterarPaginaAtual = (numeroPagina: number) => {
    setPaginalAtual(numeroPagina);
    buscarLista(numeroPagina, itensPorPagina);
  };

  const handleIrParaPaginaSeguinte = () => {
    if (paginaAtual <= totalPaginas && paginaAtual != totalPaginas) {
      setPaginalAtual(paginaAtual + 1);
      buscarLista(paginaAtual + 1, itensPorPagina);
    }
  };

  return (
    <div className={styles.tablePagination}>
      <div>
        <strong>{totalPaginas == 0 ? totalPaginas : indiceInicial}</strong> -{' '}
        <strong>
          {totalItens == 0
            ? totalItens
            : paginaAtual == totalPaginas
            ? totalItens
            : indiceFinal}
        </strong>{' '}
        de <strong>{totalItens}</strong>
      </div>
      <nav>
        <ul className={styles.tablePagination}>
          <li className={styles.tablePaginationPage}>
            <button
              className={
                paginaAtual == paginaInicial
                  ? styles.tablePaginationPageButtonDisabled
                  : styles.tablePaginationPageButton
              }
              onClick={handleIrParaPaginaAnterior}
              disabled={paginaAtual == paginaInicial}
            >
              Anterior
            </button>
          </li>
          {numerosPagina.map(numeroPagina => (
            <li key={numeroPagina} className={styles.tablePaginationPage}>
              <button
                className={
                  numeroPagina == paginaAtual
                    ? styles.tablePaginationPageButtonActive
                    : styles.tablePaginationPageButton
                }
                onClick={() => {
                  handleAlterarPaginaAtual(numeroPagina);
                }}
                disabled={numeroPagina == paginaAtual}
              >
                {numeroPagina}
              </button>
            </li>
          ))}
          <li className={styles.tablePaginationPage}>
            <button
              className={
                paginaAtual == totalPaginas || totalPaginas == 0
                  ? styles.tablePaginationPageButtonDisabled
                  : styles.tablePaginationPageButton
              }
              onClick={handleIrParaPaginaSeguinte}
              disabled={paginaAtual == totalPaginas || totalPaginas == 0}
            >
              Próxima
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
