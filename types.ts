export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
  country: string;
}

export interface Category {
  name: string;
  icon: IconName;
}

export type IconName = 'tv' | 'movies' | 'news' | 'sports' | 'kids' | 'documentary' | 'all' | 'music' | 'entertainment' | 'back' | 'settings' | 'chevron-right' | 'sort-ascending' | 'sort-descending' | 'sort-default' | 'star' | 'star-outline';