import { Component, OnInit } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/components/models/user';
import { UserService } from 'src/app/user.service';
import { TaskService } from 'src/app/tasks.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  addOnBlur = true;
  
  submittingTask = false;
  successTask = false;
  failedTask = false;
  errorType: string = "";

  user: User = {
    id: 0,
    fullName: '',
    emailAddress: '',
    password: '',
  };


  userForm: FormGroup = new FormGroup({
    fullName: new FormControl('', Validators.required),
    emailAddress: new FormControl('', Validators.required),
  });

  constructor(private userService: UserService, private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.getUsers();
  }

  setFormValues(): void {
    const dynamicValues = {
        emailAddress: this.user?.emailAddress,
      fullName: this.user?.fullName,
    };

    this.userForm.setValue(dynamicValues);
}


  private getUsers(){
    this.userService.getUserDetails().subscribe(data => {
      this.user = data
    });
  }
  
  
  onSubmit() {
        if (this.userForm.valid) {
        const formData = this.userForm.value;
        this.submittingTask = true;
            const newUser = {
                id: 0,
                emailAddress: formData.emailAddress,
                fullName: formData.fullName,
                password: this.user.password
            };
            this.taskService.updateUserData(newUser).subscribe(
                response => {
                  if(response){
                  this.successTask = true;
                  this.submittingTask = false;
                  setTimeout(() => {
                    window.location.href = '/home';
                  }, 1000);
                  } else {
                    this.errorType = `${response}`;
                  }
                },
                error => {
                  this.errorType = `${error.error}`;
                  this.submittingTask = false;
                  this.failedTask = true;
                  setTimeout(() => {
                    this.failedTask = false;
                  }, 2000);
                }
              );
        }else {
            this.submittingTask = false;
            this.failedTask = true;
              setTimeout(() => {
                this.failedTask = false;
              }, 2000);
          }
    }

}
