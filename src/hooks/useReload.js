import { useRouter } from "next/router";

export function useReload() {
  const router = useRouter();

  return () => {
    router.replace(router.asPath);
  };
}
