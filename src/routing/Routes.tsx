import {
  BrowserRouter,
  Routes as RouterDomRoutes,
  Route,
} from 'react-router-dom';

import { PublicRouting } from './PublicRouting';
import { PrivateRouting } from './PrivateRouting';
import { Incio } from '../pages/Inicio';
import { Ponto } from '../pages/Ponto';

export function Routes() {
  return (
    <BrowserRouter>
      <RouterDomRoutes>
        <Route
          path="/"
          element={
            <PublicRouting>
              <Incio />
            </PublicRouting>
          }
        />
        <Route
          path="pontos"
          element={
            <PrivateRouting>
              <Ponto />
            </PrivateRouting>
          }
        />
      </RouterDomRoutes>
    </BrowserRouter>
  );
}
