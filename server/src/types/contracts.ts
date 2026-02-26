export interface IAuthor {
  id: number;
  name: string;
  avatar: string;
}

export interface IPost {
  id: number;
  title: string;
  body: string;
  authorId: number;
  type: 'Games' | 'Sports' | 'Study' | 'Life';
}

export interface IUser {
  username: string;
  password?: string;
  isLoggedIn: boolean;
}