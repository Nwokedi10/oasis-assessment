import { User } from "./user";

export class Tasks {
    id: number;
    description: string;
    dueDate: Date;
    priority: string;
    category: string;
    title: string;
    taskId: string;
    user: User;
    completed: boolean;

    constructor() {
        this.id = 0;
        this.description = '';
        this.dueDate = new Date();
        this.priority = '';
        this.category = '';
        this.title = '';
        this.taskId = '';
        this.user = new User();
        this.completed = false;
    }
}
