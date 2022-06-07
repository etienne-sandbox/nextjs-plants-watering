import clsx from "clsx";
import { CircleWavyCheck } from "phosphor-react";
import useMutation from "use-mutation";
import { useReload } from "../hooks/useReload";
import * as api from "../logic/api";

export function WateringButton({ onClick, plantId, onSuccess }) {
  const reload = useReload();

  const [plantWatering, plantWateringInfos] = useMutation(api.plantWatering, {
    onSettled: reload,
    onSuccess,
  });

  return (
    <button
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        plantWatering(plantId);
      }}
      className="shadow-md rounded px-3 text-lg uppercase tracking-wider font-bold flex flex-row items-center gap-2 text-white bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300"
      disabled={plantWateringInfos.status === "running"}
    >
      <CircleWavyCheck className="w-6 h-6 text-white" color="currentColor" />
      <span>Arrosée !</span>
    </button>
  );
}
