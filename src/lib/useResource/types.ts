export type FilterCallback = <T>(resourceId: string, value: T) => boolean;
export type TtlCallback = <T>(resourceId: string, value: T) => number;
export interface Actions<T> {
  getResource: () => Promise<T>;
  [key: string]:
    | ((...args: any[]) => Promise<T>)
    | ((...args: any[]) => Promise<void>);
}
