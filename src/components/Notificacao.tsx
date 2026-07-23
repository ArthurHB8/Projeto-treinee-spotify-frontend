import { useNotificacao } from "../context/NotificacaoContext";

export default function Notificacao() {
  const { mensagem } = useNotificacao();

  if (!mensagem) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-60 -translate-x-1/2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black shadow-xl">
      {mensagem}
    </div>
  );
}
