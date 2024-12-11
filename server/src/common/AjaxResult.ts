export class AjaxResult<T = object> {
  /**
   * 1 成功
   * 0 失败
   *  */
  code: 0 | 1;
  message: string;
  data: T;
  constructor(code: 0 | 1, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
  static success(): AjaxResult;
  static success(arg: object): AjaxResult;
  static success(arg_1: string, arg_2?: object): AjaxResult;
  static success(arg_1?: string | object, arg_2?: object) {
    if (typeof arg_1 === 'object') {
      arg_2 = arg_1;
      arg_1 = '成功';
    }
    if (!arg_1) arg_1 = '成功';
    return new AjaxResult(1, arg_1, arg_2);
  }
  static fail(message = '失败') {
    return new AjaxResult(0, message, null);
  }
}
