import { is } from "./is";

export type Cleanup = () => void;
export type Listener<T> = (value: T) => void;
export type ValueFactory<T> = { fn: (initial?: T) => T };
export type Apply<T> = (newValue: T | ValueFactory<T>) => void;

export function factory<T>(fn: (initial?: T) => T): ValueFactory<T> {
  return { fn }
}

export interface Source<T> extends Apply<T> {
  subscribe(listener: Listener<T>): Cleanup,
  map(mapper: (value: T) => T): Source<T>
}

export function source<T>(initialValue?: T): Source<T> {
  let value: T | undefined = initialValue;
  const listeners: Set<Listener<T>> = new Set();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  }

  const map = (mapper: (value: T) => T): Source<T> => {
    const mappedSource = source<T>();
    subscribe((val) => mappedSource(mapper(val)));
    return mappedSource;
  }

  const apply: Source<T> = (newValue: T | ValueFactory<T>) => {
    if (is.valueFactory<T>(newValue)) {
      value = newValue.fn(value);
    } else {
      value = newValue;
    }
    for (const listener of listeners) listener(value);
  }

  apply.subscribe = subscribe;
  apply.map = map;

  return apply
}