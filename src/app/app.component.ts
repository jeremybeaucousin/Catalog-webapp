import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication-service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Catalog-webapp';
  appVersion = environment.appVersion;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private translate: TranslateService,
    private authenticationService: AuthenticationService) {
    // Choose langage depending on packaged local for translate service 
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang("fr");
    if (translate.getLangs().includes(locale)) {
      translate.use(locale);
    }
  }
}
