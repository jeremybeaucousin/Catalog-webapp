import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Catalog-webapp';

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private translate: TranslateService,
    private authenticationService: AuthenticationService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang("fr");
    if (translate.getLangs().includes(locale)) {
      translate.use(locale);
    }
    window.onbeforeunload = function () {
      authenticationService.logout();
    }
  }
}
