import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'; 
import { TaskService } from 'src/app/tasks.service';
import { Tasks } from 'src/app/components/models/tasks';
import { SortingService } from '../../../utils/task_sorting';
import { formatDueDate } from 'src/app/utils/format_date';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  tasks: Tasks[] = [];
  displayedColumns: string[] = ['title', 'description', 'priority', 'dueDate', 'status'];
  dataSource: MatTableDataSource<Tasks> | null = null;
  searchTerm: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private sortingService: SortingService,
    private searchRoute: ActivatedRoute,
    
  ) {
   }


   ngOnInit(): void {
    const idParam = this.searchRoute.snapshot.paramMap.get('term');
    if (idParam) {
      this.searchTerm = idParam.toString();
      this.getUserSearchTasks(this.searchTerm);
    }
  }

  private getUserSearchTasks(searchTerm: string | String) {
    this.taskService.getUserSearchTasks(searchTerm).subscribe(data => {
      this.tasks = data.map(task => ({
        ...task,
        formattedDueDate: formatDueDate(new Date(task.dueDate))
      }));

      this.dataSource = new MatTableDataSource(this.tasks);

      this.sortData('priorityDueDate');
    });
    
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
