export type FilterCallback = <T>(resourceId: string, value: T) => boolean;
export type TtlCallback = <T>(resourceId: string, value: T) => number;
export interface Actions {
  getResource: () => Promise<any>;
  [key: string]:
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => Promise<void>);
}
