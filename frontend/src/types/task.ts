export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "Completed";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}