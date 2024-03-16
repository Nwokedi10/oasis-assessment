import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private baseUrl = "http://localhost:8080/api/v1/auth";
  private createUserUrl = "/create";
  private validateUserUrl = "/validate";

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkIsAuthenticated());
    this.isAuthenticated().subscribe(authenticated => {
    });
  }

  checkIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }

  createUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.createUserUrl}`, user, { withCredentials: true }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  authenticate(emailAddress: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${this.validateUserUrl}`,
      { emailAddress, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          sessionStorage.setItem('email', emailAddress);
          this.isAuthenticatedSubject.next(true);
          return true;
        } else {
          return response;
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable().pipe(
        tap()
    );
}

logout(): Observable<boolean> {
  return this.http.post<any>(
    `${this.baseUrl}/logout`,
    null,
    { withCredentials: true } 
  ).pipe(
    map(() => {
      localStorage.removeItem('token');
      this.isAuthenticatedSubject.next(false);
      return true;
    }),
    catchError(error => {
      return of(false);
    })
  );
}

}
