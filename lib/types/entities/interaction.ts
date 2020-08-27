export type InteractionType = {
  id: string;
  type: string;
  entity: string;
  entityType: string;
  entityId: string;
  author?: string;
  createdAt?: number;
}