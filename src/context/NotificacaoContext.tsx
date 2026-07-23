import {
  useState,
  createContext,
  type ReactNode,
  useRef,
  useContext,
} from "react";

type NotificaoContextValue = {
  mensagem: string | null;
  mostrarNotificacao: (texto: string) => void;
};

const notificacaoContext = createContext<NotificaoContextValue | null>(null);

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const mostrarNotificacao = (texto: string) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    setMensagem(texto);

    timeoutRef.current = setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <notificacaoContext.Provider value={{ mensagem, mostrarNotificacao }}>
      {children}
    </notificacaoContext.Provider>
  );
}

export function useNotificacao() {
  const notificacao = useContext(notificacaoContext);
  if (!notificacao) {
    throw new Error("useNotificacao must be used within a NotificacaoProvider");
  }
  return notificacao;
}
