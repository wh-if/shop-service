import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseIntPipe,
} from '@nestjs/common';

@Injectable()
export class ParseIntPartialPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) {
      return value;
    }
    return new ParseIntPipe().transform(value, metadata);
  }
}
