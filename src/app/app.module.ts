import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';
import * as fromApp from './store/app-reducers';
import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipes/store/recipe-effects';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([ShoppingListEffects, AuthEffects, RecipeEffects]),
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService]
})
export class AppModule {}
