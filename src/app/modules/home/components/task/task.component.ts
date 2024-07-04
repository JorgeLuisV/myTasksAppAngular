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
  disabledDel: boolean = false;
  disabledCheck: boolean = false;

  private taskService = inject(TaskService);
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  ngOnChanges() {
    this.checked = this.task.completed;
  }

  completeTaskToggle(event: MatCheckboxChange) {
    this.disabledCheck = true;
    this.task.completed = event.checked;
    this.taskService
      .updateTask(this.task.id, { completed: this.task.completed })
      .pipe(tap(() => (this.disabledCheck = false)))
      .subscribe({
        error: (err) => (this.disabledCheck = false),
      });
  }

  setTaskData(task: Task) {
    this.taskService.setValueToSelectedTask(task, 'update');
    this.dialog.open(TaskFormDialogElements);
  }

  deleteTask(taskId: string) {
    this.disabledDel = true;
    this.taskService
      .deleteTask(taskId)
      .pipe(
        tap(() => {
          this.disabledDel = false;
          this._snackBar.open('¡La tarea fué eliminada!', 'cerrar', {
            duration: 3000,
          });
        })
      )
      .subscribe({
        error: () => {
          this.disabledDel = false;
          this._snackBar.open(
            'Hubo un error al eliminar la tarea, inténtalo de nuevo',
            'cerrar',
            {
              duration: 3000,
            }
          );
        },
      });
  }
}
