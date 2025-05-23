export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export interface TodoApi {
  todo: number;
  title: string;
  userId: number;
  completed: boolean;
}
