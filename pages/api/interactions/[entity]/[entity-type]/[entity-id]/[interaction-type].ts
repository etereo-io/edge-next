

// interactions are unique per user for a entity

// interaction model
{
  type: 'follow',
  entity: 'user',
  entityType: 'user',
  entityId: 'XXXX',
  createdAt: number,
  metadata: {
    ...anything
  }

}

{
  type: 'like',
  entity: 'content',
  entityType: 'post',
  entityId: 'XXXX',
  createdAt: number,
  metadata: {
    ...anything
  }
  
}