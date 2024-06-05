import { UserAuthService } from '@Modules/Auth/services/user-auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: UserAuthService,
    private userService: UserDataService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.Login();
  }

  async Login() {
    if (this.userService.Data !== undefined) {
      this.router.navigate(['tasks']);
      return;
    }

    const email = 'admin@taskman.com';
    const pass = 'sL)bA=.RU!t62D$Hz`SP9w';

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

    console.info('USERS', this.userService.Users);

    this.router.navigate(['tasks']);
  }
}
