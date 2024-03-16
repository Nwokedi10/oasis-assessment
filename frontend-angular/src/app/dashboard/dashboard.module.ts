import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OasisModule } from '../oasis-module';
import { DashboardComponent } from './dashboard.component';
import { ReminderComponent } from './dashboard-components/reminder/reminder.component';
import { TasksComponent } from './dashboard-components/tasks/tasks.component';
import { EditComponent } from './dashboard-components/edit/edit.component';
import { ProfileComponent } from './dashboard-components/profile/profile.component';
import { SearchComponent } from './dashboard-components/search/search.component';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    DashboardComponent,
    ReminderComponent,
    TasksComponent,
    EditComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    OasisModule,
    FormsModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],
  exports: [
    DashboardComponent,
    ReminderComponent,
    TasksComponent,
  ]
})
export class DashboardModule { }