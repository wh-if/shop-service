import { BadRequestException } from '@nestjs/common';
import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Category } from 'src/entity/category.entity';

export type CategoryUpdateDTO = Category;

export type CategoryInsertDTO = Pick<Category, 'avatar' | 'name' | 'parentId'>;

export type CategoryListQueryDTO = ListQueryParam<
  Category,
  'id' | 'name' | 'parentId'
>;

export type CategoryListOrderDTO = ListOrderType<Category, 'id'>;

export function validateDTO(
  dto: CategoryInsertDTO | CategoryUpdateDTO,
  isUpdate: 'insert' | 'update',
) {
  try {
    if (isUpdate === 'update') {
      Validator.required((dto as CategoryUpdateDTO).id, 'id').number();
      Validator.unRequired(dto.name, 'name').string().max(16);
    } else {
      Validator.required(dto.name, 'name').string().max(16);
    }

    Validator.unRequired(dto.avatar, 'avatar').string().max(255);
    Validator.unRequired(dto.parentId, 'parentId').number();
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
