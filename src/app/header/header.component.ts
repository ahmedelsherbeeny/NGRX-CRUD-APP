import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';

import * as fromApp from '../store/app-reducers';
import { Store } from '@ngrx/store';
import { selectUser } from '../auth/store/auth.selector';
import { logOut } from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store
      .select(selectUser)
      // .pipe(
      //   map((authState) => {
      //     console.log(authState);

      //     return authState.user;
      //   })
      // )
      .subscribe((user) => {
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
      });
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(logOut());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
