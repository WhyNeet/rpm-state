import { ValueFactory } from "./pipeline";

function valueFactory<T>(x: any): x is ValueFactory<T> {
  return x.fn !== undefined
}

export const is = {
  valueFactory
}