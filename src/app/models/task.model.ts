export type CreatedAt = {
  _seconds: number;
  _nanoseconds: number;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: CreatedAt;
  userID: string;
}

export type CreateTask = {
  title: string;
  description?: string;
};

export type UpdateTask = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export type Operation = 'create' | 'update';
