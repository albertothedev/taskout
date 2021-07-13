export type THabit = {
  habit_id: number | undefined;
  description: string;
  daily: Date | null;
  schedule: string;
  completions: number;
  user_id: number | undefined;
};

export type TTask = {
  task_id: number | undefined;
  description: string;
  completed: boolean;
  user_id: number | undefined;
};

export type TEvent = {
  event_id: number | undefined;
  description: string;
  date: Date;
  user_id: number | undefined;
};
