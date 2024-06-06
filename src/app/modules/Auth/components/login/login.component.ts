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

import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
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

  constructor(
    private authService: UserAuthService,
    private userService: UserDataService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.setForm();
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      if (this.userService.Data !== undefined) {
        this.router.navigate(['tasks']);
        return;
      }

      const email = this.form.get('email')?.value; // 'admin@taskman.com';
      const pass = this.form.get('password')?.value; //'sL)bA=.RU!t62D$Hz`SP9w';

      // const email = 'adrianmelian@taskman.com';
      // const pass = 'Ma-9E+p3TB=qQXLR{wjW;Y';

      const result = await this.authService.Login(email, pass);

      if (!result) {
        return;
      }

      const data = await this.userService.read(email);

      if (!data) {
        return;
      }

      this.userService.Data = data.pop();
      await this.userService.read();
      this.isLoading = false;

      this.router.navigate(['tasks']);
    } catch (error) {
      this.isLoading = false;
    }
  }

  /**
   * Set the FormGroup properties
   */
  setForm() {
    this.form = this._formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
