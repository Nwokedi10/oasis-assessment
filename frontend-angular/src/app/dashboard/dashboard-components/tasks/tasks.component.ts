import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { TaskService } from 'src/app/tasks.service';
import { Tasks } from 'src/app/components/models/tasks';
import { SortingService } from '../../../utils/task_sorting';
import { formatDueDate } from 'src/app/utils/format_date';
import { User } from 'src/app/components/models/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Tasks[] = [];
  displayedColumns: string[] = ['title', 'description', 'priority', 'dueDate', 'status'];
  dataSource: MatTableDataSource<Tasks> | null = null;
  myCategories: string[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private sortingService: SortingService
  ) {
   }


  ngOnInit(): void {
    this.getUserTasks();
    
  }

  private getUserTasks() {
    this.taskService.getUserTasks().subscribe(data => {
      this.tasks = data.map(task => ({
        ...task,
        formattedDueDate: formatDueDate(new Date(task.dueDate))
      }));

      this.dataSource = new MatTableDataSource(this.tasks);

      this.sortData('priorityDueDate');
    });
    
    setTimeout(() => {
      this.myCategories = this.sortingService.getCategories();
    }, 500);
    
  }
  
  sortData(sortOrder: string): void {
    if (this.dataSource) {
      this.sortingService.sortData(this.dataSource, sortOrder);
    }
  }
  editTask(task: Tasks): void {
    this.router.navigate(['/edit', task.taskId]);
  }

  getColor(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'basic';
      case 'High':
        return 'primary';
      case 'Medium':
        return 'accent';
      case 'Critical':
        return 'warn';
      default:
        return '';
    }
  }
}
