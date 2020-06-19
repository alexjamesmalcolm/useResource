export type FilterCallback = <T>(resourceId: string, value: T) => boolean;
export type GetResourceId = () => string;
export interface Resource {
  isLoading: boolean;
  error: Error | false | undefined;
  data: any;
  acquiredDate?: Date;
}
