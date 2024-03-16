import { Component, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/components/models/user';
import { UserService } from 'src/app/user.service';
import { TaskService } from 'src/app/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Tasks } from 'src/app/components/models/tasks';
import { throwError } from 'rxjs';


export interface Category {
  name: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent implements OnInit {

  addOnBlur = true;
  
  submittingTask = false;
  deletingTask = false;
  successTask = false;
  failedTask = false;
  deleteTask = false;

  taskId: string | null = null;
  task: Tasks | null = null;
  updateCategory: string | null = null;

  user: User = {
    id: 0,
    fullName: '',
    emailAddress: '',
    password: '',
  };


  separatorKeysCodes = [ENTER, COMMA];

  categories: Category[] = [{ name: 'All' }];



  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

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

  constructor(private userService: UserService, private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.getUsers();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.taskId = idParam.toString();
      this.getTask(this.taskId);
    }
  }
  
  getCurrentDateTime(): string {
    return new Date().toISOString().split('.')[0];
  }

  setFormValues(): void {
    const dynamicValues = {
      title: this.task?.title,
      category: this.task?.category,
      description: this.task?.description,
      dueDate: this.task?.dueDate,
      status: this.task?.completed,
      priority: this.task?.priority,
    };

    this.taskForm.setValue(dynamicValues);
}


  private getTask(id: string): void {
    this.taskService.getTaskBytaskId(id).subscribe(task => {
      this.task = task;
      this.setFormValues();
    },
    error => {
      if(error.error.description != ""){
        alert(error.error.description);
        this.router.navigate(['/tasks']);
      }
    }
    );
  }
  private getUsers(){
    this.userService.getUserDetails().subscribe(data => {
      this.user = data
    });
  }
  parseCategories(categoryString: string): string[] {
    if (!categoryString) {
      return [];
    }
    return categoryString.split(',').map(category => category.trim());
  }
  
  onSubmit() {
    if (this.taskForm.valid) {
      this.submittingTask = true;
      const formData = this.taskForm.value;
      if(formData.category != this.task?.category){
        this.updateCategory = formData.category;
      } else {
        this.updateCategory = this.task?.category?? '';
      }
      const newtask = {
        id: 0,
        category: this.updateCategory ?? '',
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        title: formData.title,
        completed: formData.status,
        taskId: this.task?.taskId ?? '',
        user: { 
          id: this.user.id,
          fullName: this.user.fullName,
          emailAddress: this.user.emailAddress,
          password: this.user.password
        }
      };
      if (this.task) {
        this.taskService.updateTask(this.task.taskId, newtask).subscribe(
          response => {
            this.successTask = true;
            this.submittingTask = false;
            setTimeout(() => {
              this.router.navigate(['/tasks']);
            }, 1000);
          },
          error => {
            if(error.error.description != ""){
              alert(error.error.description);
              setTimeout(() => {
                this.failedTask = false;
                this.submittingTask = false;
              }, 500);
            } else {
              setTimeout(() => {
                this.failedTask = false;
              }, 1000);
            }
          }
        );
      } 
    } else {
      this.submittingTask = false;
      this.failedTask = true;
      setTimeout(() => {
        this.failedTask = false;
      }, 1000);
    }
  }
  onDeleteClicked(): void {
    if (this.task && this.task.taskId) {
      this.deletingTask = true;
      this.taskService.deleteTask(this.task.taskId).subscribe(
        () => {
          this.deletingTask = false;
          this.deleteTask = true;
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 2000);
        },
        (error) => {
          this.deletingTask = false;
          this.failedTask = true;
          setTimeout(() => {
            this.failedTask = false;
          }, 1000);
        }
      );
    } else {
      this.deletingTask = false;
    }
  }
  

}
