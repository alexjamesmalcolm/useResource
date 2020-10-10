export type FilterCallback = <T>(resourceId: string, value: T) => boolean;
export type TtlCallback = <T>(resourceId: string, value: T) => number;
export interface OtherActions<T> {
  [key: string]: (...args: any[]) => Promise<T | void>;
}
