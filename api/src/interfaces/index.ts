export interface IUser {
  user_id: number;
  email: string;
  username: string;
  password: string;
  confirmed: boolean;
}

export interface ITask {
  task_id: number;
  description: string;
  completed: boolean;
  user_id: number;
}

export interface IHabit {
  habit_id: number;
  description: string;
  schedule: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun">;
  completions: number;
  daily: boolean;
  user_id: number;
}

export interface IEvent {
  event_id: number;
  description: string;
  date: string;
  user_id: number;
}
