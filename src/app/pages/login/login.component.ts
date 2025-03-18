import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly fb = inject(FormBuilder).nonNullable;
  readonly router = inject(Router);

  readonly loginForm = this.fb.group({
    name: [' ', [Validators.required, Validators.minLength(2)]],
  });

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  guestLogin() {
    if (this.loginForm.valid && this.loginForm.value.name) {
      this.isSubmitting.set(true);
      sessionStorage.setItem('guestName', this.loginForm.value.name);
      this.router.navigate(['/']);
    }
  }
}
