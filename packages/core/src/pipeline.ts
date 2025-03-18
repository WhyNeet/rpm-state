export type Cleanup = () => void;
export type Listener<T> = (value: T) => void;
export type Apply<T> = (newValue: T) => void;

export interface Pipeline<T> extends Apply<T> {
  subscribe(listener: Listener<T>): Cleanup,
  map(mapper: (value: T) => T): Pipeline<T>,
}

export function pipeline<T>(): Pipeline<T> {
  const listeners: Set<Listener<T>> = new Set();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  }

  const map = (mapper: (value: T) => T): Pipeline<T> => {
    const mappedSource = pipeline<T>();
    subscribe((val) => mappedSource(mapper(val)));
    return mappedSource;
  }

  const apply: Pipeline<T> = (value: T) => {
    for (const listener of listeners) listener(value);
  }

  apply.subscribe = subscribe;
  apply.map = map;

  return apply
}