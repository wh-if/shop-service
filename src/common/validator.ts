export class Validator {
  key: string;
  stack: Array<(target: any) => void>;
  skip: boolean;

  constructor(key: string = '') {
    this.key = key;
    this.stack = [];
    this.skip = false;
  }

  static validate(key?: string) {
    return new Validator(key);
  }

  required() {
    this.stack.unshift((target) => {
      if (typeof target === 'undefined') {
        throw new Error(`Validation Failed: ${this.key}缺失`);
      }
    });
    return this;
  }

  unRequired() {
    this.stack.unshift((target) => {
      if (typeof target === 'undefined') {
        this.skip = true;
        return;
      }
    });
    return this;
  }

  check(target: any) {
    this.stack.forEach((fn) => {
      if (this.skip) {
        return;
      }
      fn(target);
    });
    return this;
  }

  number() {
    this.stack.push((target) => {
      if (typeof target !== 'number') {
        throw new Error(`Validation Failed: ${this.key}需要是 number 类型`);
      }
    });

    return this;
  }

  string() {
    this.stack.push((target) => {
      if (typeof target !== 'string') {
        throw new Error(`Validation Failed: ${this.key}需要是 string 类型`);
      }
    });

    return this;
  }

  min(limit: number) {
    this.stack.push((target) => {
      if (typeof target === 'number' && target < limit) {
        throw new Error(`Validation Failed: ${this.key}需要大于 ${limit}`);
      } else if (typeof target === 'string' && target.length < limit) {
        throw new Error(`Validation Failed: ${this.key}长度需要大于 ${limit}`);
      }
    });

    return this;
  }

  max(limit: number) {
    this.stack.push((target) => {
      if (typeof target === 'number' && target > limit) {
        throw new Error(`Validation Failed: ${this.key}需要小于 ${limit}`);
      } else if (typeof target === 'string' && target.length > limit) {
        throw new Error(`Validation Failed: ${this.key}长度需要小于 ${limit}`);
      }
    });

    return this;
  }
}
