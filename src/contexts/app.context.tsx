import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';

import { StorageHelper } from '../helpers';

type AppProviderProps = {
  children: ReactNode;
};

type Store = {
  colaborador?: {
    id?: string;
    codigo: string;
  };
};

type AppContextDataTypes = {
  store: Store;
  saveToStore: (item: any) => void;
  removeUserData: () => void;
};

const AppContext = createContext({} as AppContextDataTypes);

export function AppProvider({ children }: AppProviderProps) {
  const [store, setStore] = useState<Store>({});
  const storageHelper = new StorageHelper();

  useEffect(() => {
    const storageData = storageHelper.getLocal('ilumeoponto.userdata');
    if (!storageData) return;
    const parsedStorageData = JSON.parse(storageData);
    setStore(previousState => ({
      ...previousState,
      ...parsedStorageData,
    }));
  }, []);

  const saveToStore = (data: any) => {
    if (data.colaborador) {
      const userData = {
        ...store,
        colaborador: data.colaborador,
      };
      storageHelper.setLocal('ilumeoponto.userdata', JSON.stringify(userData));
    }
    setStore(previousState => ({
      ...previousState,
      ...data,
    }));
  };

  const removeUserData = () => {
    storageHelper.removeLocal('ilumeoponto.userdata');
    setStore({});
  };

  return (
    <AppContext.Provider
      value={{
        store,
        saveToStore,
        removeUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
