export class Validator {
  target: any;
  key: string;
  private skip: boolean;

  constructor(target: any, key: string = '', skipUndef: boolean = false) {
    this.target = target;
    this.key = key;
    this.skip = skipUndef;
  }

  static validate(target: any) {
    return new Validator(target);
  }

  static required(target: any, key: string) {
    if (typeof target === 'undefined') {
      throw new Error(`验证不通过: ${key}缺失`);
    }

    return new Validator(target, key);
  }

  static unRequired(target: any, key: string) {
    let skip = false;
    if (typeof target === 'undefined') {
      skip = true;
    }

    return new Validator(target, key, skip);
  }

  number() {
    if (!this.skip && typeof this.target !== 'number') {
      throw new Error(`验证不通过: ${this.key}需要是 number 类型`);
    }

    return this;
  }

  string() {
    if (!this.skip && typeof this.target !== 'string') {
      throw new Error(`验证不通过: ${this.key}需要是 string 类型`);
    }

    return this;
  }

  min(limit: number) {
    if (!this.skip && typeof this.target === 'number' && this.target < limit) {
      throw new Error(`验证不通过: ${this.key}需要大于 ${limit}`);
    } else if (typeof this.target === 'string' && this.target.length < limit) {
      throw new Error(`验证不通过: ${this.key}长度需要大于 ${limit}`);
    }

    return this;
  }

  max(limit: number) {
    if (!this.skip && typeof this.target === 'number' && this.target > limit) {
      throw new Error(`验证不通过: ${this.key}需要小于 ${limit}`);
    } else if (typeof this.target === 'string' && this.target.length > limit) {
      throw new Error(`验证不通过: ${this.key}长度需要小于 ${limit}`);
    }

    return this;
  }
}
