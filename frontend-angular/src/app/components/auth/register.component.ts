import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule, ReactiveFormsModule, MatCheckboxModule, MatRadioModule, MatButtonModule],
  providers: [
    AuthService
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  
  checked = true;
  hide = true;
  createdAccount = false;
  failedAccount = false;
  errorType: string = "";

  togglePasswordVisibility(input: any): void {
    this.hide = !this.hide;
    input.type = this.hide ? 'password' : 'text';
  }

  createForm: FormGroup = new FormGroup({
    fullName: new FormControl('', Validators.required),
    emailAddress: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  
  constructor(private _router: Router, private authService: AuthService) { }

  ngOnInit(): void {}

  onProcessRegister(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      if(formData.password === formData.confirmPassword){
      const newAccount = {
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        password: formData.password,
      };
      const user = new User();
      user.fullName = newAccount.fullName;
      user.emailAddress = newAccount.emailAddress;
      user.password = newAccount.password;
      
      this.authService.createUser(user).subscribe(
        response => {
          if(response.access_token){
            this.createdAccount = true;
            setTimeout(() => {
              this._router.navigate(['/login']);
            }, 2000);
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            this.errorType = `${error.error}`;
         }
          else {
            this.errorType = "Unknown Error";
          }
          this.failedAccount = true;
          setTimeout(() => {
            this.failedAccount = false;
          }, 2500);
        }
      );
      } else {
        this.failedAccount = true;
      this.errorType = "Please passwords do not match";
      setTimeout(() => {
        this.failedAccount = false;
      }, 3000);
      }
    } else {
      this.failedAccount = true;
      this.errorType = "Please review form fields";
      setTimeout(() => {
        this.failedAccount = false;
      }, 3000);
    }
    
  }
}
