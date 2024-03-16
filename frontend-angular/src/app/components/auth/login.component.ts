import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule, ReactiveFormsModule, MatCheckboxModule, MatRadioModule, MatButtonModule],
  providers: [
    AuthService
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  
  checked = true;
  
  constructor(private _router: Router, private authService: AuthService) { }

  hide = true;
  loggingUser = false;
  loggedIn = false;
  failedLogin = false;
  errorType: string = "";


  togglePasswordVisibility(input: any): void {
    this.hide = !this.hide;
    input.type = this.hide ? 'password' : 'text';
  }


  loginForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    if(this.authService.checkIsAuthenticated()){
      window.location.href="/home";
    }
  }

  onProcessLogin(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const newAccount = {
        emailAddress: formData.emailAddress,
        password: formData.password,
      };
      this.authService.authenticate(newAccount.emailAddress, newAccount.password).subscribe(
        response => {
          if(response.access_token != ""){
            document.cookie = `email=${formData.emailAddress}`;
            window.location.href="/home";
            this._router.navigate(['/home']);
          } else {
            this.failedLogin = true;
            this.errorType = `Unable to validate login at the moment`;
          }
        },
        error => {
          if(error.status == 403){
            this.errorType = 'Invalid credentials';
          }
          this.failedLogin = true;
          this.errorType = `${error.error}`;
        }
      );

    } else {
      this.failedLogin = true;
      this.errorType = "Please review form data";
      setTimeout(() => {
        this.failedLogin = false;
      }, 3000);
    }
  }
  
}

