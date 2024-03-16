import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './dashboard/dashboard-components/tasks/tasks.component';
import { EditComponent } from './dashboard/dashboard-components/edit/edit.component';
import { ProfileComponent } from './dashboard/dashboard-components/profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { ForgotComponent } from './components/auth/forgot.component';
import { AuthGuard } from './components/auth/auth_guard';
import { SearchComponent } from './dashboard/dashboard-components/search/search.component';

const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent,  },
  { path: "forgot", component: ForgotComponent, },

  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/home", pathMatch: "full" },
      { path: "home", component: DashboardComponent, canActivate: [AuthGuard] },
      { path: "tasks", component: TasksComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'search/:term', component: SearchComponent, canActivate: [AuthGuard] },
    ]
  },

  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
