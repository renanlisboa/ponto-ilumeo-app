import { ToastContainer } from 'react-toastify';

import { AppProvider } from './contexts';
import { Routes } from './Routes';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.styles.css';

function App() {
  return (
    <div>
      <AppProvider>
        <Routes />
        <ToastContainer autoClose={2000} position="top-right" />
      </AppProvider>
    </div>
  );
}

export default App;
