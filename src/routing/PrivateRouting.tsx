import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '../contexts';

type PrivateRoutingProps = {
  children: ReactElement;
};

export function PrivateRouting({ children }: PrivateRoutingProps) {
  const { store } = useAppContext();
  if (!store.colaborador) return <Navigate to="/" />;
  return children;
}
