export type BlogPost = {
  id: number;
  title: string;
  content: string;
  author: string;
  status: 'published' | 'unpublished';
}

export type Author = {
  id: number;
  name: string;
}

export type BlogPostCreateProps = {
  title: string;
  content: string;
  author: Author;
  status: 'published' | 'unpublished';
}