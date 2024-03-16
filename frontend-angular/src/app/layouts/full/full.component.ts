import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/components/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/components/models/user';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}


@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {
  searchTerm: string = '';
  search: boolean = false;
  user: User = {
    id: 0,
    fullName: '',
    emailAddress: '',
    password: '',
  };

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private userService: UserService, private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router) { }

  routerActive: string = "activelink";

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/home",
      icon: "home",
      menu: "Dashboard",
    },
    {
      link: "/tasks",
      icon: "file-text",
      menu: "Tasks",
    },
  ]

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(){
    this.userService.getUserDetails().subscribe(data => {
      this.user = data
    });
  }

  navigateToSearch(searchTerm: string): void {
    if (searchTerm) {
      this.router.navigate(['/search', searchTerm]);
    }
  }
  
  onLogout(){
    this.authService.logout().subscribe(success => {
      if (success) {
        window.location.href="/login";
      }
    });
  }

  

}
