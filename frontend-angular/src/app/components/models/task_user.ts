import { User } from './user'; 

export class TaskWithUser {
  completed: boolean;
  category: string;
  description: string;
  dueDate: Date;
  priority: string;
  title: string;
  taskId: string;
  user: User;

  constructor(
    completed: boolean,
    category: string,
    description: string,
    dueDate: Date,
    priority: string,
    title: string,
    taskId: string,
    user: User
  ) {
    this.completed = completed;
    this.category = category;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.title = title;
    this.taskId = taskId;
    this.user = user;
  }


}
