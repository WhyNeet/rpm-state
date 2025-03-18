import { Pipeline } from "@rpm-state/core"
import { useEffect, useState } from "react"

export function usePipeline<T>(pipeline: Pipeline<T>): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    return pipeline.subscribe(setValue)
  }, []);

  return value;
}