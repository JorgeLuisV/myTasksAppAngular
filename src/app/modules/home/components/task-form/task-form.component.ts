import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Signal,
  inject,
} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ButtonComponent } from '@shared/components/button/button.component';
import { TaskService } from '@services/task.service';
import { CreateTask, Task, UpdateTask } from '@models/task.model';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormDialogElements {
  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.minLength(3)]],
  });
  status: RequestStatus = 'init';

  private taskService = inject(TaskService);
  task: Signal<Task | null> = this.taskService.selectedTask;

  readonly dialog = inject(MatDialog);
  @Output() newTaskData = new EventEmitter();
  private _snackBar = inject(MatSnackBar);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const taskValue = this.task();
    if (taskValue) {
      this.form.patchValue({
        title: taskValue.title,
        description: taskValue.description,
      });
    }
  }

  get taskValue(): Task | null {
    return this.task();
  }

  saveTask() {
    if (this.form.valid) {
      this.status = 'loading';

      const operation = this.taskService.operation;
      const { title, description } = this.form.getRawValue();

      let taskData: CreateTask | UpdateTask = { title };
      if (description) taskData.description = description;

      let saveOperation$;

      if (operation === 'create') {
        saveOperation$ = this.taskService.createTask(taskData as CreateTask);
      } else if (operation === 'update') {
        saveOperation$ = this.taskService.updateTask(
          this.taskValue!.id,
          taskData as UpdateTask
        );
      }

      if (saveOperation$) {
        saveOperation$
          .pipe(
            tap(() => {
              this.status = 'success';
              this.dialog.closeAll();
              const action = operation === 'create' ? 'creada' : 'editada';
              this._snackBar.open(`¡La tarea ha sido ${action}!`, 'cerrar', {
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
    } else {
      this.form.markAllAsTouched();
    }
  }
}
