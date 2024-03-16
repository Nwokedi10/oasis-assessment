import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap((authenticated: boolean) => {
        if (!authenticated) {
          this.router.navigate(['/login']); 
        } else if (state.url.includes('login') || state.url.includes('register') || state.url.includes('forgot')) {
          this.router.navigate(['/home']); 
        }
      })
    );
  }
}
