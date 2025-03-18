import { Pipeline, pipeline } from "./pipeline";

export interface Store<T> extends Pipeline<T> {
  get(): T;
}

export function store<T>(initialValue: T): Store<T> {
  let value = initialValue;

  const get = () => value;

  const pipe = pipeline<T>();
  const store: Store<T> = (newValue: T) => {
    pipe(newValue);
    value = newValue;
  };

  store.subscribe = pipe.subscribe;
  store.get = get;
  store.map = pipe.map;

  return store;
}