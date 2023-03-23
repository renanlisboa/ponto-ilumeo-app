import { ToastContainer } from 'react-toastify';

import { AppProvider } from './contexts';
import { Routes } from './routing/Routes';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.styles.css';

function App() {
  return (
    <div>
      <AppProvider>
        <Routes />
        <ToastContainer position="top-right" />
      </AppProvider>
    </div>
  );
}

export default App;
