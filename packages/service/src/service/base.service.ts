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
      if (Array.isArray(value)) {
        if (value.length !== 2) {
          throw new BadRequestException(
            `Validation Failed: 列表查询参数${key.toString()}应该是长度为 2 的数组，表示开始和结束。`,
          );
        }
      } else {
        throw new BadRequestException(
          `Validation Failed: 列表查询参数${key.toString()}需要是 Array[string] 类型`,
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
      if (!Array.isArray(value)) {
        throw new BadRequestException(
          `Validation Failed: 列表查询参数${key.toString()}需要是 Array[string] 类型`,
        );
      }
      sqlBuilder.andWhere(
        `${tableName}.${key as string} IN (:...${key as string})`,
        {
          [key]: value,
        },
      );
    });
  }

  /**
   * 获得一个添加了分页和排序的构造器
   * @param sqlBuilder 构造器
   * @param options 参数
   * @returns
   */
  withPageOrderBuilder<T>(
    sqlBuilder: SelectQueryBuilder<T>,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: string;
      order?: 'ASC' | 'DESC';
    },
  ) {
    if (options.page && options.pageSize) {
      sqlBuilder
        .limit(options.pageSize)
        .offset((options.page - 1) * options.pageSize);
    }

    if (options.orderBy && options.order) {
      sqlBuilder.orderBy(
        `${sqlBuilder.alias}.${options.orderBy}`,
        options.order,
      );
    }
    return sqlBuilder;
  }
}
