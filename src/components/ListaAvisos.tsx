import { diaMes } from "@/lib/datas";
import type { Aviso } from "@/sanity/lib/queries";
import { SeloExemplo } from "./SeloExemplo";

export function ListaAvisos({ avisos }: { avisos: Aviso[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {avisos.map((a) => (
        <li key={a._id} className="flex flex-col rounded-[10px] bg-placa p-7">
          {a.exemplo && (
            <div className="mb-4">
              <SeloExemplo />
            </div>
          )}
          <p className="text-lg leading-relaxed whitespace-pre-line">{a.texto}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
            <p className="rotulo text-suave">Até {diaMes(a.validoAte)}</p>
            {a.link && (
              <a
                href={a.link}
                className="link-sutil text-[0.9375rem]"
                {...(/^https?:\/\//.test(a.link) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Saiba mais
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
