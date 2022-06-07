import { format } from "date-fns";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useMutation from "use-mutation";

export function TimeTravel() {
  const [today, setToday] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/time-travel", { signal: controller.signal })
      .then((res) => res.json())
      .then(({ today }) => setToday(today))
      .catch((err) => {});
    return () => controller.abort();
  }, []);

  const [goToNextDay] = useMutation(
    () =>
      fetch("/api/time-travel", { method: "POST" }).then((res) => res.json()),
    {
      onSuccess: ({ data }) => {
        setToday(data.today);
        router.replace(router.asPath);
      },
    }
  );

  const todayResolved = today ? format(new Date(today), "yyyy-MM-dd") : null;

  return (
    <div className="bg-gray-50 shadow-lg rounded-xl p-4 flex flex-col gap-2">
      <h2 className="uppercase text-sm font-semibold text-slate-500 leading-tight">
        Time Travel
      </h2>
      <div className="flex flex-row items-center">
        <p className="flex-1 text-lg">
          <span>{`Aujourd'hui: `}</span>
          <span className="font-bold">{todayResolved ?? "..."}</span>
        </p>
        <button
          onClick={goToNextDay}
          className="bg-slate-600 text-white rounded px-3 py-1 hover:bg-slate-700"
        >
          Jour suivant
        </button>
      </div>
    </div>
  );
}
