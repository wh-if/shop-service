import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export class BaseService {
  /**
   * 列表查询构造
   * @param sqlBuilder 构造器
   * @param tableName 表名
   * @param query 查询参数
   * @param keys 查询参数分类
   */
  genWhereSql<T, G>(
    sqlBuilder: SelectQueryBuilder<T>,
    tableName: string,
    query: G,
    keys: Record<
      'stringType' | 'timeType' | 'enumType' | 'numberType',
      (keyof G)[]
    >,
  ) {
    keys.stringType.forEach((key) => {
      const value = query[key];
      if (!value) {
        return;
      }
      sqlBuilder.andWhere(
        `${tableName}.${key as string} LIKE :${key as string}`,
        {
          [key]: `%${value}%`,
        },
      );
    });

    [...keys.timeType, ...keys.numberType].forEach((key) => {
      const value = query[key] as [string, string];
      if (!value) {
        return;
      }
      if (value.length !== 2) {
        throw new BadRequestException(
          `${key as string} 应该是长度为 2 的数组，表示开始和结束。`,
        );
      }
      const isTimeRangne = keys.timeType.includes(key);
      let start: Date | number | string;
      let end: Date | number | string;
      [start, end] = value;

      if (start) {
        start = parseInt(start);
        if (isTimeRangne) {
          start = new Date(start);
        }
        const paramName = (key as string) + 'start';
        sqlBuilder.andWhere(`${tableName}.${key as string} >= :${paramName}`, {
          [paramName]: start,
        });
      }

      if (end) {
        end = parseInt(end);
        if (isTimeRangne) {
          end = new Date(end);
        }
        const paramName = (key as string) + 'end';
        sqlBuilder.andWhere(`${tableName}.${key as string} <= :${paramName}`, {
          [paramName]: end,
        });
      }
    });

    keys.enumType.forEach((key) => {
      const value = query[key] as string[];
      if (!value) {
        return;
      }
      sqlBuilder.andWhere(
        `${tableName}.${key as string} IN (:...${key as string})`,
        {
          [key]: value,
        },
      );
    });
  }
}
