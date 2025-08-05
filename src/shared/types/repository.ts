export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt?: number;
}

export interface Repository<T extends BaseEntity> {
  getAll(): Promise<ServiceResult<T[]>>;
  getById(id: string): Promise<ServiceResult<T>>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResult<T>>;
  update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<ServiceResult<T>>;
  delete(id: string): Promise<ServiceResult<void>>;
  exists(id: string): Promise<boolean>;
}

export interface LocalStorageRepositoryConfig {
  storageKey: string;
  version: string;
}

export interface StorageData<T extends BaseEntity> {
  version: string;
  items: T[];
}