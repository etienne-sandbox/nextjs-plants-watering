import { FlowerLotus } from "phosphor-react";

export function Logo() {
  return (
    <span className="flex flex-row justify-center items-center gap-4 text-blue-400">
      <FlowerLotus
        weight="light"
        className="w-12 h-12 mt-1"
        color="currentColor"
      />
      <span className="text-4xl uppercase tracking-[0.5rem] font-sans font-light">
        Plants
      </span>
    </span>
  );
}
