export type CommentType {
  id: string;
  author: string;
  message: string;
  slug?: string;
  contentType: string;
  contentId: string;
  conversationId?:string;
}