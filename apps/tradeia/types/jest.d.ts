// Type definitions for Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBe(expected: any): R;
      toEqual(expected: any): R;
      toBeDefined(): R;
      toBeNull(): R;
      toBeGreaterThan(expected: number): R;
      toContain(expected: any): R;
      toHaveProperty(property: string): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toBeInstanceOf(expected: any): R;
      toThrow(error?: any): R;
      toMatch(expected: string | RegExp): R;
    }

    interface Mock<T = any> extends Function {
      (...args: any[]): T;
      mock: {
        calls: any[][];
        instances: T[];
        invocationCallOrder: number[];
        results: { type: 'return' | 'throw'; value: any }[];
      };
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
      mockImplementation(fn: (...args: any[]) => any): Mock<T>;
      mockImplementationOnce(fn: (...args: any[]) => any): Mock<T>;
      mockReturnValue(value: any): Mock<T>;
      mockReturnValueOnce(value: any): Mock<T>;
      mockResolvedValue(value: any): Mock<Promise<T>>;
      mockResolvedValueOnce(value: any): Mock<Promise<T>>;
      mockRejectedValue(value: any): Mock<Promise<T>>;
      mockRejectedValueOnce(value: any): Mock<Promise<T>>;
    }

    function fn<T = any>(implementation?: (...args: any[]) => T): Mock<T>;
    function spyOn<T extends {}, M extends keyof T>(
      object: T,
      method: M
    ): T[M] extends (...args: any[]) => any ? Mock<T[M]> : never;
  }

  const describe: {
    (name: string, fn: () => void): void;
    each: (table: any[][]) => (name: string, fn: (...args: any[]) => void) => void;
    only: (name: string, fn: () => void) => void;
    skip: (name: string, fn: () => void) => void;
  };

  const it: {
    (name: string, fn: () => void | Promise<void>): void;
    each: (table: any[][]) => (name: string, fn: (...args: any[]) => void) => void;
    only: (name: string, fn: () => void | Promise<void>) => void;
    skip: (name: string, fn: () => void | Promise<void>) => void;
  };

  const test: typeof it;

  const expect: {
    <T>(actual: T): jest.Matchers<T>;
    any: (constructor: any) => any;
    arrayContaining: (arr: any[]) => any;
    objectContaining: (obj: object) => any;
    stringContaining: (str: string) => any;
    stringMatching: (str: string | RegExp) => any;
  };

  const beforeEach: (fn: () => void | Promise<void>) => void;
  const afterEach: (fn: () => void | Promise<void>) => void;
  const beforeAll: (fn: () => void | Promise<void>) => void;
  const afterAll: (fn: () => void | Promise<void>) => void;
}

export {};