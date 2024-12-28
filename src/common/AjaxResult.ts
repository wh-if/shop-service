/**
 * 1 成功
 * 0 失败
 *  */
type CodeType = 0 | 1;

export class AjaxResult {
  code: CodeType;
  message: string;
  data: object;

  constructor(code: CodeType, message: string, data: object) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(): AjaxResult;
  static success(data: object): AjaxResult;
  static success(message: string, data?: object): AjaxResult;
  static success(arg_1?: string | object, arg_2?: object) {
    if (arguments.length === 0) {
      return new AjaxResult(1, 'success', undefined);
    } else if (arguments.length === 1) {
      return new AjaxResult(1, 'success', arg_1 as object);
    } else {
      return new AjaxResult(1, arg_1 as string, arg_2);
    }
  }

  static fail(message = 'fail') {
    return new AjaxResult(0, message, null);
  }

  /**
   * 若为boolean 值，则根据它判断是否成功；若为object，则成功并返回数据；若为string，则作为失败消息返回。
   */
  static judge(data: any) {
    if (typeof data === 'boolean') {
      return data ? AjaxResult.success() : AjaxResult.fail();
    } else if (typeof data === 'object') {
      return AjaxResult.success(data);
    } else {
      return AjaxResult.fail(typeof data === 'string' ? data : 'fail');
    }
  }
}
