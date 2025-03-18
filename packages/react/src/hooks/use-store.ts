import { Store } from "@rpm-state/core";
import { useEffect, useState } from "react";

export function useStore<T>(store: Store<T>): T {
  const [value, setValue] = useState(store.get());

  useEffect(() => {
    return store.subscribe(setValue);
  }, [])

  return value;
}