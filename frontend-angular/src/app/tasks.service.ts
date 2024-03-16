import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tasks } from './components/models/tasks';
import { User } from './components/models/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = "http://localhost:8080/api/v1/account";
  private addTaskUrl = "/addTask";
  private getUserTasksUrl = "/tasks";
  private viewTaskUrl = "/userTask";
  private updateTaskUrl = "/updateTask";
  private deleteTaskUrl = "/deleteTask";
  private updateUserUrl = "/updateUser";
  private searchTasksUrl = "/search";

  constructor(private httpClient: HttpClient) { }

  createTask(task: Tasks): Observable<any> {
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<any>(`${this.baseUrl}${this.addTaskUrl}/${emailAddress}`, task, { headers: headers, withCredentials: true });
  }

  getUserTasks(): Observable<Tasks[]> {
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Tasks[]>(`${this.baseUrl}${this.getUserTasksUrl}/${emailAddress}`, { headers: headers, withCredentials: true });
  }

  getUserSearchTasks(term: String): Observable<Tasks[]> {
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Tasks[]>(`${this.baseUrl}${this.searchTasksUrl}/${term}/${emailAddress}`, { headers: headers, withCredentials: true });
  }
 
  getTaskBytaskId(id: string): Observable<Tasks> {
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Tasks>(`${this.baseUrl}${this.viewTaskUrl}/${id}/${emailAddress}`, { headers: headers, withCredentials: true });
  }
  
  updateTask(id: string, newTask: Tasks): Observable<object>{
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put(`${this.baseUrl}${this.updateTaskUrl}/${id}/${emailAddress}`, newTask, { headers: headers, withCredentials: true });
    
  }

  deleteTask(id: string): Observable<Object>{
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.baseUrl}${this.deleteTaskUrl}/${id}/${emailAddress}`, { headers: headers, withCredentials: true });
    
  }
  
  updateUserData(newUser: User): Observable<object>{
    const token = localStorage.getItem('token'); 
    const emailAddress = this.getEmailFromCookie();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put(`${this.baseUrl}${this.updateUserUrl}/${emailAddress}`, newUser, { headers: headers, withCredentials: true });
    
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
