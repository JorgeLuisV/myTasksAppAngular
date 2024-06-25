import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@services/auth.service';
import { TaskService } from '@services/task.service';

import { TaskFormDialogElements } from '../../components/task-form/task-form.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TaskComponent } from '../../components/task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestStatus } from '@models/request-status.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonToggleModule,
    ButtonComponent,
    TaskFormDialogElements,
    TaskComponent,
    FontAwesomeModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tasksList = this.taskService.tasksList;
  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    switch (this.filter()) {
      case 'all':
        return this.tasksList();
      case 'pending':
        return this.tasksList().filter((task) => !task.completed);
      case 'completed':
        return this.tasksList().filter((task) => task.completed);
    }
  });
  status: RequestStatus = 'init';
  faSpinner = faSpinner;
  faClipboardCheck = faClipboardCheck;

  readonly dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.status = 'loading';
    this.taskService
      .getTasks()
      .pipe(
        tap(() => {
          this.status = 'success';
        })
      )
      .subscribe({
        error: (err) => {
          this.status = 'failed';
          console.error(err);
        },
      });
  }

  setFilter(value: 'all' | 'pending' | 'completed') {
    this.filter.set(value);
  }

  openDialog() {
    this.taskService.setValueToSelectedTask(null, 'create');
    this.dialog.open(TaskFormDialogElements);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
