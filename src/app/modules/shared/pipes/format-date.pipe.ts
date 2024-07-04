import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CreatedAt } from '@models/task.model';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(timestamp: CreatedAt): string {
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
    return this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm') || '';
  }
}
