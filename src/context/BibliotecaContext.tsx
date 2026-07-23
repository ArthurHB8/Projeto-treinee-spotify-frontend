import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type BibliotecaContextValue = {
  versaoBiblioteca: number;
  invalidarBiblioteca: () => void;
};

const BibliotecaContext = createContext<BibliotecaContextValue | null>(null);

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [versaoBiblioteca, setVersaoBiblioteca] = useState(0);

  const invalidarBiblioteca = useCallback(() => {
    setVersaoBiblioteca((atual) => atual + 1);
  }, []);

  return (
    <BibliotecaContext.Provider
      value={{ versaoBiblioteca, invalidarBiblioteca }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca() {
  const context = useContext(BibliotecaContext);
  if (!context) {
    throw new Error("useBiblioteca must be used within a BibliotecaProvider");
  }
  return context;
}
