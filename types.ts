
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category: string;
  created_at: string;
  author_id: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_premium: boolean;
  price: number;
  route: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string | null;
  user_name: string | null;
  content: string;
  created_at: string;
  parent_id?: string | null; // For replies
  replies?: Comment[];      // For nesting on client-side
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'vip';
  display_name?: string;
  avatar_url?: string;
}
