type MemberType = {
  id: string;
  roles: string[]
}

export declare type GroupEntityType = {
  id: string;
  slug: string;
  type: string;
  members: MemberType[];
  pendingMembers: MemberType[];
  draft: boolean;
  author: string;
  createdAt: string;
}