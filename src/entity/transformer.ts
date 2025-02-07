export const booleanToNumberTransformer = {
  from(value: any): boolean {
    return value === 1;
  },
  to(value: boolean): number {
    return value ? 1 : 0;
  },
};

export const numberArrayTransformer = {
  from(value: string[]): number[] {
    return value.map((v: string) => parseInt(v, 10));
  },
  to(value: number[]): any {
    return value;
  },
};
