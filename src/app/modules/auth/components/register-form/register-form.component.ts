import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/components/button/button.component';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
})
export class RegisterFormComponent {
  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });
  status: RequestStatus = 'init';
  failedMessage = '';
  readonly dialog = inject(MatDialog);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email } = this.form.getRawValue();

      this.authService.register(email).subscribe({
        next: () => {
          this.status = 'success';
          this.dialog.closeAll();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.status = 'failed';
          if (err instanceof HttpErrorResponse) {
            this.failedMessage =
              err.status === 401
                ? 'Ya existe un usuario con ese correo'
                : 'Error al crear el usuario, intente nuevamente';
          }
          this.cdr.detectChanges();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
