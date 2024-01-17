export interface User {
  name: string;
  avatar: string;
}

export interface Comment {
  comment: string;
  user: User;
}
