import Link from "next/link";
import { Leaf } from "phosphor-react";
import { frequencyText } from "../logic/utils";
import { WateringButton } from "./WateringButton";
import { WateringRecap } from "./WateringRecap";
import { useState, useEffect } from "react";
import clsx from "clsx";

export function PlantItem({ plant }) {
  const [wattered, setWattered] = useState(false);

  useEffect(() => {
    let cancel = false;
    setTimeout(() => {
      if (cancel) {
        return;
      }
      setWattered(false);
    }, 5000);
    return () => {
      cancel = true;
    };
  }, [wattered]);

  return (
    <div className="flex flex-row gap-3 border rounded-md py-2 px-3 items-center relative group border-blue-200 bg-blue-50">
      <div className="flex flex-col flex-1">
        <div className="flex flex-row gap-1 items-center">
          <Leaf
            className="w-6 h-6 text-blue-400"
            weight="duotone"
            color="currentColor"
          />
          <Link href={`/plant/${plant.id}`}>
            <a
              className="text-lg group-hover:underline text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {plant.name}
            </a>
          </Link>
        </div>
        <div className="flex flex-row items-center font-light text-xs gap-2 italic text-slate-500">
          <p>
            {plant.species} ({frequencyText(plant.frequency)})
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "absolute right-3 inset-y-2 flex invisible",
          !wattered && "group-hover:visible"
        )}
      >
        <WateringButton
          plantId={plant.id}
          onSuccess={() => {
            setWattered(true);
          }}
        />
      </div>
      <div className={clsx(wattered ? "visible" : "group-hover:invisible")}>
        <WateringRecap
          nextWatering={plant.nextWatering}
          frequency={plant.frequency}
        />
      </div>
    </div>
  );
}
