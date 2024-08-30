// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable rxjs-angular/prefer-takeuntil */
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { Login, LoginResponse } from '@app/core/auth/login/interfaces/login.interface';
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
  private readonly router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: SocialAuthService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.authService.authState.subscribe(user => {
      this.authSvc
        .loginGoogle(user.idToken)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          res => {
            this.onLoginSuccess(res);
          },
          err => {
            this.onLoginFailed(err);
          },
        );
    });
  }

  onLoginFormSubmitted() {
    if (!this.loginForm.valid) {
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.authSvc
      .login(this.loginForm.value as Login)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          this.onLoginSuccess(res);
        },
        err => {
          this.onLoginFailed(err);
        },
      );
  }

  onLoginSuccess(res: LoginResponse): void {
    if (res && res?.data) {
      this.errorMessage = '';
      this.authSvc.storeTokens(res);
      this.router.navigate(['/dashboard']);
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoginFailed(err: any): void {
    this.showMessageLoginFailed(err?.error?.code || 0);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  showMessageLoginFailed(code: number): void {
    switch (code) {
      case 102:
        this.errorMessage = 'COMMON.ERROR.INCORRECT_INFO';
        break;
      case 103:
        this.errorMessage = 'COMMON.ERROR.CONFIRM_ACCOUNT';
        break;
      case 104:
        this.errorMessage = 'COMMON.ERROR.ACCOUNT_DEACTIVE';
        break;
      case 114:
        this.errorMessage = 'COMMON.ERROR.EMAIL_NON_EMAIL';
        break;
      case 115:
        this.errorMessage = 'COMMON.ERROR.EMAIL_REJECT';
        break;
      default:
        this.errorMessage = 'COMMON.ERROR.FAILED_TO_LOGIN';
    }
  }
}
