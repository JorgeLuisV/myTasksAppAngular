import { Component, Input, inject } from '@angular/core';
import {
  MatCheckboxModule,
  MatCheckboxChange,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

import { Task } from '@models/task.model';
import { FormsModule } from '@angular/forms';
import { TaskService } from '@services/task.service';
import { TaskFormDialogElements } from '../task-form/task-form.component';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    FormatDatePipe,
    FormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;

  checked: boolean = false;
  taskDate: string = '';
  readonly faXmark = faXmark;
  disabled: boolean = false;

  private taskService = inject(TaskService);
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  ngOnChanges() {
    this.checked = this.task.completed;
  }

  completeTaskToggle(event: MatCheckboxChange) {
    this.task.completed = event.checked;

    this.taskService
      .updateTask(this.task.id, { completed: this.task.completed })
      .pipe(
        tap(() => {
          console.log('Task updated successfully');
        })
      )
      .subscribe({
        error: (err) => {
          console.error(err);
        },
      });
  }

  setTaskData(task: Task) {
    this.taskService.setValueToSelectedTask(task, 'update');
    this.dialog.open(TaskFormDialogElements);
  }

  deleteTask(taskId: string) {
    this.disabled = true;
    this.taskService
      .deleteTask(taskId)
      .pipe(
        tap(() => {
          this.disabled = false;
          this._snackBar.open('¡La tarea fué eliminada!', 'cerrar', {
            duration: 3000,
          });
        })
      )
      .subscribe({
        error: (err) => {
          console.error(err);
        },
      });
  }
}
