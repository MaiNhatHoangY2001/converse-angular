// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable rxjs-angular/prefer-takeuntil */
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { Login } from '@app/core/auth/login/interfaces';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    HeaderComponent,
    TranslateModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    GoogleSigninButtonModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly authSvc = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  loginForm!: FormGroup;
  isLoading = false;

  constructor(private authService: SocialAuthService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.authService.authState.subscribe(user => {
      console.log(user);
      console.log(user2);
      //perform further logics
    });
  }

  onLoginFormSubmitted() {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    this.authSvc
      .login(this.loginForm.value as Login)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('run');

        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}
