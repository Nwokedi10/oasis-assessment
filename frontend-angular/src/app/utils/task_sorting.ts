import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tasks } from '../components/models/tasks';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  private myCategories: string[] = [];
  private myCategories2: string[] = [];

  constructor() {
    this.myCategories = [];
  }

  updateCategories(categories: string[]): void {
    this.myCategories2 = categories;
  }

  getCategories(): string[] {
    return this.myCategories2;
  }
  
  

  sortData<T>(dataSource: MatTableDataSource<Tasks>, sortOrder: string): void {
    const sortedData = dataSource.data.slice();

    const categoriesSet = new Set<string>();
    sortedData.forEach(item => {
      categoriesSet.add(item.category);
    });
    const myCategories: string[] = Array.from(categoriesSet);
    this.updateCategories(myCategories);
    this.getCategories();

    switch (sortOrder) {
      case 'asc':
        sortedData.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'desc':
        sortedData.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case 'priorityAsc':
        sortedData.sort((a, b) => a.priority.localeCompare(b.priority));
        break;
      case 'priorityDesc':
        sortedData.sort((a, b) => b.priority.localeCompare(a.priority));
        break;
      case 'statusAsc':
        sortedData.sort((a, b) => {
          if (a.completed === b.completed) {
            return 0;
          } else if (a.completed) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case 'statusDesc':
        sortedData.sort((a, b) => {
          if (a.completed === b.completed) {
            return 0;
          } else if (a.completed) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      case 'priorityDueDate':
        sortedData.sort((a, b) => {
          const priorityComparison = a.priority.localeCompare(b.priority);
          if (priorityComparison === 0) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          } else {
            return priorityComparison;
          }
        });
        break;
      default:
        break;
    }

    dataSource.data = sortedData;
  }
}
