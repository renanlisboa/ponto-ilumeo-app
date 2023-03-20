import {
  BrowserRouter,
  Routes as RouterDomRoutes,
  Route,
} from 'react-router-dom';

import { Incio } from './pages/Inicio';
import { Ponto } from './pages/Ponto';

export function Routes() {
  return (
    <BrowserRouter>
      <RouterDomRoutes>
        <Route path="/" element={<Incio />} />
        <Route path="pontos" element={<Ponto />} />
      </RouterDomRoutes>
    </BrowserRouter>
  );
}
