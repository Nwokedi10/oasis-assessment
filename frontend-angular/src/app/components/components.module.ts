import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    FormsModule
  ],
  exports: [
  ],
  declarations: [
  ]
})
export class ComponentsModule { }
