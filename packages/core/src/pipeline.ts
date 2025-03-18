export type Cleanup = () => void;
export type Listener<T> = (value: T) => void;
export type Apply<T> = (newValue: T) => void;

export interface Pipeline<T> extends Apply<T> {
  subscribe(listener: Listener<T>): Cleanup,
  map(mapper: (value: T) => T): Pipeline<T>,
  combine<P, R>(other: Pipeline<P>, combiner: (val1: T, val2: P) => R): Pipeline<R>,
  filter(filter: (value: T) => boolean): Pipeline<T>
}

export function pipeline<T>(): Pipeline<T> {
  const listeners: Set<Listener<T>> = new Set();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  }

  const map = <P>(mapper: (value: T) => P): Pipeline<P> => {
    const mappedSource = pipeline<P>();
    subscribe((val) => mappedSource(mapper(val)));
    return mappedSource;
  }

  const combine = <P, R>(other: Pipeline<P>, combiner: (val1: T, val2: P) => R): Pipeline<R> => {
    const combined = pipeline<R>();
    const values = new Array(2);
    const pipelines = [subscribe, other.subscribe];
    let initialized = 0;

    for (let i = 0; i < pipelines.length; i++) {
      pipelines[i](value => {
        values[i] = value;
        initialized += 1;
        if (initialized >= pipelines.length) {
          combined(combiner(values[0], values[i]));
        }
      });
    }

    return combined;
  }

  const filter = (filter: (value: T) => boolean): Pipeline<T> => {
    const filtered = pipeline<T>();

    subscribe(val => filter(val) && filtered(val));

    return filtered;
  }

  const apply: Pipeline<T> = (value: T) => {
    for (const listener of listeners) listener(value);
  }

  apply.subscribe = subscribe;
  apply.map = map;
  apply.combine = combine;
  apply.filter = filter;

  return apply
}