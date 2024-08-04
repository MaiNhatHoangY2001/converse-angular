export interface Card {
  title: string;
  img: string;
  description?: string;
  rating?: number;
}

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}
