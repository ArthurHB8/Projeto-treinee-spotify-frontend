import playIcon from "../assets/icons/playIcon.svg";
import removeIcon from "../assets/icons/deleteRecent.svg";

type SearchResultRowProps = {
  imageUrl: string | null;
  title: string;
  subtitle: string;
  rounded?: boolean;
  showPlayIcon?: boolean;
  onClick: () => void;
  onRemove?: () => void;
};

export default function SearchResultRow({
  imageUrl,
  title,
  subtitle,
  rounded = false,
  showPlayIcon = false,
  onClick,
  onRemove,
}: SearchResultRowProps) {
  const arredondado = rounded ? "rounded-full" : "rounded-sm";

  return (
    <div className="group flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-white/10">
      <button
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="relative h-10 w-10 shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`h-10 w-10 object-cover ${arredondado}`}
            />
          ) : (
            <div
              className={`h-10 w-10 bg-[#2a2a2a] ${arredondado}`}
              aria-hidden="true"
            />
          )}
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <img src={playIcon} alt="" className="h-3 w-3 invert" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="text-texto-secundario truncate text-xs">{subtitle}</p>
        </div>
      </button>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remover da busca recente"
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <img src={removeIcon} alt="" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
