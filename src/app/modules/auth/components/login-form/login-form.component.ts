import { Component, ChangeDetectorRef } from '@angular/core';
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
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
})
export class LoginFormComponent {
  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });
  status: RequestStatus = 'init';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email } = this.form.getRawValue();

      this.authService.login(email).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/home']);
        },
        error: () => {
          this.status = 'failed';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
