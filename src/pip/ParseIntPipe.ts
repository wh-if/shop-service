import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const _parseIntPipe = new ParseIntPipe();

    if (Array.isArray(value)) {
      const newValue: number[] = [];
      for (const v of value) {
        newValue.push(await _parseIntPipe.transform(v, metadata));
      }
      return newValue;
    } else {
      throw new BadRequestException(
        `Validation Failed: 参数${metadata.data.toString()}需要是 Array[number] 类型`,
      );
    }
  }
}
