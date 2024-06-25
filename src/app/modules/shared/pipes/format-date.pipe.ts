import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

import { CreatedAt } from '@models/task.model';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(timestamp: CreatedAt): string {
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
    return format(date, 'dd/MM/yyyy, HH:mm');
  }
}
