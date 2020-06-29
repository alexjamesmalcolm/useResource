export type FilterCallback = <T>(resourceId: string, value: T) => boolean;
export interface Actions {
  getResource: () => Promise<any>;
  [key: string]: (() => Promise<any>) | (() => Promise<void>);
}
