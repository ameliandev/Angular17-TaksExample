import { CommonModule } from '@angular/common';
import { UserAuthService } from '@Modules/Auth/services/user-auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { UserData } from '@Modules/Auth/models/user-data.model';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  formLoaded = false;
  loginResponse: string = '';

  constructor(
    private authService: UserAuthService,
    private userService: UserDataService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    if (this.userService.Data !== undefined) {
      this.navigateTo('tasks');
      return;
    }

    this.setForm();
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loginResponse = '';
    this.isLoading = true;

    setTimeout(async () => {
      try {
        const loginData = this.getFormData();

        this.formLoaded = false;

        const result = await this.authService.Login(
          loginData.email,
          loginData.password
        );

        if (!result) {
          this.resetForm();
          return;
        }

        const data = await this.userService.read(loginData.email);

        if (!data) {
          return;
        }

        await this.setMainLoginData(data);
        this.isLoading = false;
        this.navigateTo('tasks');
      } catch (error) {
        this.isLoading = false;
        this.formLoaded = true;
      }
    }, 1500);
  }

  getFormData(): { email: string; password: string } {
    return {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  /**
   * Set the FormGroup properties
   */
  setForm() {
    this.form = this._formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    this.formLoaded = true;
  }

  async setMainLoginData(data: Array<UserData>) {
    this.userService.Data = data.pop();
    await this.userService.read();
  }

  resetForm() {
    this.formLoaded = true;
    this.isLoading = false;
    this.loginResponse = 'Wrong user';
  }
}
