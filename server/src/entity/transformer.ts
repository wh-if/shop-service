export const booleanToNumberTransformer = {
  from(value: any): boolean {
    return value === 1;
  },
  to(value: boolean): number {
    return value ? 1 : 0;
  },
};
