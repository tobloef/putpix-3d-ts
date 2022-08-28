type Brand<K, T> = K & { __brand: T };

/*
  Usage example:

  type Kilometers = Brand<number, 'Kilometers'>;
  type Miles = Brand<number, 'Miles'>;

  const doSomethingWithKilometers = (_kilometers: Kilometers): void => {};

  doSomethingWithKilometers(123); // Will fail
  doSomethingWithKilometers(123 as Miles); // Will fail
  doSomethingWithKilometers(123 as Kilometers); // Will succeed
*/

export default Brand;
