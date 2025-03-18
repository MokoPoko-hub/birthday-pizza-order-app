import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passphrase',
  imports: [ReactiveFormsModule],
  templateUrl: './passphrase.component.html',
  styleUrl: './passphrase.component.css',
})
export class PassphraseComponent {
  readonly fb = inject(FormBuilder).nonNullable;
  readonly router = inject(Router);

  readonly passphraseForm = this.fb.group({
    passphrase: ['', Validators.required],
  });

  readonly errorMessage = signal('');

  // I know its not best idea to make athorization like that, but its simple app for party with friends
  checkPassphrase() {
    if (this.passphraseForm.value.passphrase === 'ITSMEMARIO') {
      localStorage.setItem('accessGranted', 'true');
      this.router.navigate(['/login']);
    } else {
      this.errorMessage.set('Wrong passphrase baka!');
    }
  }
}
