import { UserData } from '@Modules/Auth/models/user-data.model';
import { UserDataService } from '@Modules/Auth/services/user-data.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  visible = false;
  _userData: UserData | undefined = undefined;

  private _userDataService: UserDataService = inject(UserDataService);

  ngOnInit(): void {
    this._userData = this._userDataService.Data;
    this.visible = this._userData !== undefined;
  }
}
