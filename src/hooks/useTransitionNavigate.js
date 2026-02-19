import { startTransition } from "react";
import { useRouter } from "next/navigation";

const useTransitionNavigate = () => {
  const router = useRouter();

  const navigate = (path, options) => {
    startTransition(() => {
      router.push(path, options); // App Router doesn't need asPath parameter
    });
  };

  return navigate;
};

export default useTransitionNavigate;
