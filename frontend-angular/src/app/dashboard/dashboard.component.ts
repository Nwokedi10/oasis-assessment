import { Component, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { User } from '../components/models/user';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../tasks.service';
import { Router } from '@angular/router';
import { generateUniqueID } from '../utils/id_generator';
import { minDateTimeValidator } from '../utils/min_date'; 



export interface Category {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  addOnBlur = true;
  submittingTask = false;
  successTask = false;
  failedTask = false;

  user: User = {
    id: 0,
    fullName: '',
    emailAddress: '',
    password: '',
  };

  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    dueDate: new FormControl(['', [Validators.required, minDateTimeValidator()]]),
    priority: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });


  separatorKeysCodes = [ENTER, COMMA];

  categories: Category[] = [{ name: 'All' }];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.categories.push({ name: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(category: any): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  edit(category: Category, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(category);
      return;
    }

    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories[index].name = value;
    }
  }

  constructor(private userService: UserService, private taskService: TaskService, private router: Router) { }
  

  ngOnInit(): void {
    this.getUsers();
  }

  getCurrentDateTime(): string {
    return new Date().toISOString().split('.')[0];
  }

  private getUsers(){
    this.userService.getUserDetails().subscribe(data => {
      this.user = data
    });
  }
  onSubmit() {
    if (this.taskForm.valid) {
      this.submittingTask = true;
      const formData = this.taskForm.value;
      const task = {
        id: 0,
        category: formData.category,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        title: formData.title,
        completed: formData.status,
        taskId: generateUniqueID(),
        user: { 
          id: this.user.id,
          fullName: this.user.fullName,
          emailAddress: this.user.emailAddress,
          password: this.user.password,
          role: 'USER',
        }
      };
      this.taskService.createTask(task).subscribe(
        response => {
          this.successTask = true;
          this.submittingTask = false;
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 2000);
        },
        error => {
          this.submittingTask = false;
          this.failedTask = true;
          setTimeout(() => {
            this.failedTask = false;
          }, 2000);
        }
      );
    } else {
      this.submittingTask = false;
      this.failedTask = true;
        setTimeout(() => {
          this.failedTask = false;
        }, 2000);
    }
  }
  
  


}
