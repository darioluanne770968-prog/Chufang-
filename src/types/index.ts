export interface Recipe {
  id: number;
  title: string;
  image: string;
  author: string;
  authorAvatar?: string;
  likes?: number;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  cookTime?: string;
  difficulty?: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  followers: number;
  following: number;
  recipes: number;
}
