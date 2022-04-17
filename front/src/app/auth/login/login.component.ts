import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs/operators';
import { LoadinService } from 'src/app/core/services/loadin.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

/**
 * Login-1 component
 */
export class LoginComponent implements OnInit {
  submitted = false;
  error = '';
  returnUrl: string = '';
  type: string;
  spinner: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loadinService: LoadinService
  ) {
    if (this.authService.isLoggedIn) {
      this.authService.redirectLoggedUser(this.authService.currentUser);
    }
  }

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [true],
  });

  ngOnInit(): void {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.submitted = false;
      return;
    } else {
      this.submitted = true;
      this.spinner = true;
      (
        await this.authService.login(
          this.f.email.value,
          this.f.password.value,
          this.f.rememberMe.value
        )
      ).subscribe(
        async (user: any) => {
          this.authService.redirectLoggedUser(this.authService.currentUser);
          this.spinner = false;
        },
        async (error) => {
          if ((await error.status) === 401) {
            this.type = 'danger';
            this.error = 'Email ou mot de passe incorrect';
          }
          if ((await error.status) == undefined) {
            this.type = 'warning';
            this.error = 'Verifier Votre connexion';
          }
          this.spinner = false;
        }
      );
    }
  }
}
