import {
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
} from 'react';

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
  setStore: Dispatch<SetStateAction<Store>>;
};

const AppContext = createContext({} as AppContextDataTypes);

export function AppProvider({ children }: AppProviderProps) {
  const [store, setStore] = useState<Store>({});

  return (
    <AppContext.Provider value={{ store, setStore }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
