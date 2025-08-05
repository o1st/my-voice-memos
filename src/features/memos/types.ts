import type { BaseEntity } from '@shared/types';

export interface Memo extends BaseEntity {
  title: string;
  description: string;
}
