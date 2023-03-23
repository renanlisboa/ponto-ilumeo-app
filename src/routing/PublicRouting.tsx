import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '../contexts';

type PublicRoutingProps = {
  children: ReactElement;
};

export function PublicRouting({ children }: PublicRoutingProps) {
  const { store } = useAppContext();
  if (store.colaborador) return <Navigate to="/pontos" />;
  return children;
}
