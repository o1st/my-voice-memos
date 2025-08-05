import type { 
  Repository, 
  BaseEntity, 
  ServiceResult, 
  LocalStorageRepositoryConfig, 
  StorageData 
} from '../types/repository';

export class LocalStorageRepository<T extends BaseEntity> implements Repository<T> {
  private config: LocalStorageRepositoryConfig;

  constructor(config: LocalStorageRepositoryConfig) {
    this.config = config;
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const stored = localStorage.getItem(this.config.storageKey);
    if (!stored) {
      const initialData: StorageData<T> = {
        version: this.config.version,
        items: []
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(initialData));
    }
  }

  private async getStoredData(): Promise<StorageData<T>> {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) {
        throw new Error('Data not found in localStorage');
      }
      
      const data: StorageData<T> = JSON.parse(stored);
      
      if (data.version !== this.config.version) {
        console.warn(`Data version (${data.version}) does not match current version (${this.config.version})`);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error reading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async saveData(data: StorageData<T>): Promise<void> {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      throw new Error(`Error saving data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateId(): string {
    return `${this.config.storageKey}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async getAll(): Promise<ServiceResult<T[]>> {
    try {
      const data = await this.getStoredData();
      const sortedItems = data.items.sort((a, b) => b.createdAt - a.createdAt);
      
      return {
        success: true,
        data: sortedItems
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting items'
      };
    }
  }

  async getById(id: string): Promise<ServiceResult<T>> {
    try {
      const data = await this.getStoredData();
      const item = data.items.find(item => item.id === id);
      
      if (!item) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      return {
        success: true,
        data: item
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting item'
      };
    }
  }

  async create(itemData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResult<T>> {
    try {
      const data = await this.getStoredData();
      const now = Date.now();
      
      const newItem: T = {
        ...itemData,
        id: this.generateId(),
        createdAt: now
      } as T;

      data.items.push(newItem);
      await this.saveData(data);

      return {
        success: true,
        data: newItem
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creating item'
      };
    }
  }

  async update(id: string, updateData: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<ServiceResult<T>> {
    try {
      const data = await this.getStoredData();
      const itemIndex = data.items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      const existingItem = data.items[itemIndex];
      const updatedItem: T = {
        ...existingItem,
        ...updateData,
        id: existingItem.id,
        createdAt: existingItem.createdAt,
        updatedAt: Date.now()
      };

      data.items[itemIndex] = updatedItem;
      await this.saveData(data);

      return {
        success: true,
        data: updatedItem
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error updating item'
      };
    }
  }

  async delete(id: string): Promise<ServiceResult<void>> {
    try {
      const data = await this.getStoredData();
      const itemIndex = data.items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      data.items.splice(itemIndex, 1);
      await this.saveData(data);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error deleting item'
      };
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const data = await this.getStoredData();
      return data.items.some(item => item.id === id);
    } catch (error) {
      return false;
    }
  }
}