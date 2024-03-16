import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minDateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDateTime = control.value;
    const now = new Date();

    if (selectedDateTime < now.toISOString()) {
      return { 'minDateTime': { value: selectedDateTime } };
    }
    
    return null;
  };
}
