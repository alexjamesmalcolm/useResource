export type ResourceId = string;
export type FilterCallback = <T>(resourceId: ResourceId, value: T) => boolean;
export type GetResourceId = () => string;
