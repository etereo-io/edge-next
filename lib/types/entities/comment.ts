export type CommentType = {
  id: string;
  author: string;
  message: string;
  slug?: string;
  contentType: string;
  groupId?: string;
  groupType?: string;
  contentId: string;
  conversationId?:string;
}