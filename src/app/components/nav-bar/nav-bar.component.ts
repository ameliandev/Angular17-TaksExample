import { UserData } from '@Modules/Auth/models/user-data.model';
import { UserAuthService } from '@Modules/Auth/services/user-auth.service';
import { UserDataService } from '@Modules/Auth/services/user-data.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule, FlexLayoutModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit, OnDestroy {
  visible = false;
  _userData: UserData | undefined = undefined;

  private _userDataService: UserDataService = inject(UserDataService);
  private _userAuthService: UserAuthService = inject(UserAuthService);
  private _router: Router = inject(Router);

  ngOnInit(): void {
    this._userDataService.onUserDataSet.subscribe((userData) => {
      this._userData = userData;
      this.visible = this._userData !== undefined;
    });
  }

  ngOnDestroy(): void {
    this.visible = false;
  }

  onLogout() {
    const result = this._userAuthService.Logout();
    this._router.navigate(['login']);
  }
}
