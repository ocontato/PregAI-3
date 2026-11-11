export type SermonStatus = 'published' | 'draft';

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  biblicalReferences: string; // e.g. "João 3:16; Romanos 8:28"
  category: string;
  categorySlug: string;
  author: string;
  imageUrl: string;
  keywords: string[];
  status: SermonStatus;
  featured: boolean;
  readingTimeMinutes: number;
  publishedAt: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  count?: number;
}

export interface Illustration {
  id: string;
  title: string;
  story: string;
  application: string;
  biblicalReference: string;
  category: string;
  imageUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  sermonId: string;
  sermonTitle: string;
  sermonCategory: string;
  sermonAuthor: string;
  sermonImageUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  facebook?: string;
  whatsapp?: string;
  telegram?: string;
  spotify?: string;
}

export interface AdBannerConfig {
  enabled: boolean;
  tag: string;
  sponsorName?: string;
  badgeText?: string;
  title: string;
  description: string;
  ctaText: string;
  linkUrl: string;
  imageUrl?: string;
  updatedAt?: string;
}

