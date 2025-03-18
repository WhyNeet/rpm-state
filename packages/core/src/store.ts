import { Cleanup, Pipeline, pipeline } from "./pipeline";

export interface Store<T> extends Pipeline<T> {
  get(): T;
  on<P>(pipeline: Pipeline<P>, mapper: (state: T, value: P) => T): Cleanup;
}

export function store<T>(initialValue: T): Store<T> {
  let value = initialValue;

  const get = () => value;

  const pipe = pipeline<T>();
  const store: Store<T> = (newValue: T) => {
    pipe(newValue);
    value = newValue;
  };

  const on = <P>(pipeline: Pipeline<P>, mapper: (state: T, value: P) => T): Cleanup => {
    return pipeline.subscribe((out) => store(mapper(value, out)))
  }

  store.subscribe = pipe.subscribe;
  store.get = get;
  store.map = pipe.map;
  store.on = on;
  store.filter = pipe.filter;
  store.combine = pipe.combine;

  return store;
}