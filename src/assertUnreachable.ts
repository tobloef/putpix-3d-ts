const assertUnreachable = (_x: never): never => {
  throw new Error("If this Error is thrown, something has gone wrong with TypeScript.");
};

export default assertUnreachable;