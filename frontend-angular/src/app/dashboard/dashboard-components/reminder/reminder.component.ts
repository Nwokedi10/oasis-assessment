import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/tasks.service';
import { formatDueDate } from 'src/app/utils/format_date';


interface Reminder {
  time: string;
  ringColor: string;
  message: string;
}

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
})
export class ReminderComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getHighestPriorityTasks();
  }

  activity: Reminder[] = [];

  private getHighestPriorityTasks() {
    this.taskService.getUserTasks().subscribe(data => {
      const sortedTasks = data
        .map(task => ({
          ...task,
          dueDate: new Date(task.dueDate) 
        }))
        .filter(task => task.priority !== 'None') 
        .sort((a, b) => {
          const priorityOrder = ['Low', 'Medium', 'High', 'Critical'];
          const priorityComparison = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
          if (priorityComparison === 0) {
            return a.dueDate.getTime() - b.dueDate.getTime(); 
          }
          return priorityComparison;
        });
  
      const top5Tasks = sortedTasks.slice(0, 5);
      this.activity = top5Tasks.map(task => ({
        time: formatDueDate(task.dueDate),
        ringColor: this.getRingColor(task.priority),
        message: task.title
      }));
    });
  }
  

  

  private getRingColor(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'ring-success';
      case 'Medium':
        return 'ring-primary';
      case 'High':
        return 'ring-info';
      case 'Critical':
        return 'ring-warning';
      default:
        return 'ring-danger';
    }
  }
  
}
