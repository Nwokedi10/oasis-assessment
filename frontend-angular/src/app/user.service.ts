import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from './components/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "http://localhost:8080/api/v1/account";
  private userUrl = "/user";

  constructor(private httpClient: HttpClient) { }

  getUserDetails(): Observable<User> {
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<User>(`${this.baseUrl}${this.userUrl}/${emailAddress}`, { headers: headers, withCredentials: true });
  }

  private getEmailFromCookie(): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'email') {
        return decodeURIComponent(value);
      }
    }
    return '';
  }
}

