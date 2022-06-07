import { useMemo } from "react";
import { isPlainObject } from "../logic/utils";

export function ErrorBox({ error }) {
  const message = useMemo(() => {
    if (isPlainObject(error)) {
      if (error.error === "slug-already-exists") {
        return "Erreur: Le slug existe déjà !";
      }
      if (error.error === "invalid-username-password") {
        return "Erreur: Nom d'utilisateur ou mot de passe invalide !";
      }
      if (error.message) {
        return `Erreur: ${error.message}`;
      }
      if (error.status) {
        return `Erreur: ${error.status}`;
      }
    }
    return `Erreur`;
  }, [error]);

  return (
    <p className="text-slate-900 bg-red-400 rounded-md px-4 py-2">{message}</p>
  );
}
