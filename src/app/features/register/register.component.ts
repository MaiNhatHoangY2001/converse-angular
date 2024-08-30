import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { LoginResponse } from '@app/core/auth/login/interfaces/login.interface';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
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
    GoogleSigninButtonModule,
    CommonModule,
    CheckboxModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly authSvc = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private ngUnsubscribe = new Subject<void>();
  private readonly router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  signUpForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = '';

  constructor(private authService: SocialAuthService) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required],
        agree_policy: [false, Validators.required],
      },
      {
        validators: this.matchValidator('password', 'confirm_password'),
      },
    );

    this.authService.authState.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.authSvc
        .loginGoogle(user.idToken)
        .pipe(takeUntil(this.ngUnsubscribe))
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

  onSignUpFormSubmitted() {
    if (!this.signUpForm.valid) {
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    // this.authSvc
    //   .login(this.loginForm.value as Login)
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(
    //     res => {
    //       this.onLoginSuccess(res);
    //     },
    //     err => {
    //       this.onLoginFailed(err);
    //     },
    //   );
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

  matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    };
  }
}
