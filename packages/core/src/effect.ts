import { Cleanup, Pipeline } from "./pipeline";

export type EffectCallback<T> = (value: T) => void;
export type EffectApply<T> = (source: Pipeline<T>) => Cleanup;

export interface Effect<T> extends EffectApply<T> { }

export function effect<T>(callback: EffectCallback<T>): Effect<T> {
  return (source) => {
    const cleanup = source.subscribe(callback);
    return cleanup;
  }
}