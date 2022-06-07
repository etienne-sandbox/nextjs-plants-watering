import clsx from "clsx";
import { Alarm, BellRinging, Drop, DropHalfBottom } from "phosphor-react";

export function WateringRecap({ nextWatering, frequency, align = "right" }) {
  if (nextWatering === 0) {
    return (
      <Layout
        title="Arrosage"
        subtitle="aujourd'hui"
        icon={BellRinging}
        className="text-blue-500"
        align={align}
      />
    );
  }
  if (nextWatering < 0) {
    return (
      <Layout
        title="Manque d'eau"
        subtitle={`depuis ${daysToText(nextWatering)}`}
        icon={Alarm}
        className="text-red-500"
        align={align}
      />
    );
  }
  // nextWatering > 0
  const progress = nextWatering / frequency;
  const color = nextWatering <= 2 ? "text-green-600" : "text-gray-500";
  return (
    <Layout
      title="Arrosage"
      subtitle={daysToText(nextWatering)}
      icon={progress >= 0.5 ? Drop : DropHalfBottom}
      className={color}
      align={align}
    />
  );
}

function Layout({ title, subtitle, icon: Icon, className, align }) {
  return (
    <div
      className={clsx(
        "flex gap-2 items-center self-stretch",
        align === "left" ? "flex-row" : "flex-row-reverse",
        className
      )}
    >
      <Icon weight="duotone" className="w-9 h-9 mt-1" color="currentColor" />
      <div
        className={clsx(
          "leading-tight flex flex-col",
          align === "left" ? "items-start" : "items-end"
        )}
      >
        <p className="font-bold">{title}</p>
        <p className="text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

function daysToText(days) {
  if (days === -1) {
    return "hier";
  }
  if (days === -2) {
    return "avant-hier";
  }
  if (days < 0) {
    return `${-days} jours`;
  }
  if (days === 1) {
    return "demain";
  }
  if (days === 2) {
    return "après-demain";
  }
  return `dans ${days} jours`;
}
