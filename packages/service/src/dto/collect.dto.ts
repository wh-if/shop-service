import { ORDER_DETAIL_TYPE } from 'src/common/constant';
import { Validator } from 'src/common/validator';
import { Collect } from 'src/entity/collect.entity';

export type CollectInsertDTO = Pick<Collect, 'targetId' | 'targetType'>;

export const CollectValidator: Partial<
  Record<keyof CollectInsertDTO, Validator>
> = {
  targetId: Validator.validate('targetId').number(),
  targetType: Validator.validate('targetType').enum(ORDER_DETAIL_TYPE),
};
