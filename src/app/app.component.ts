import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Catalog-webapp';

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang(locale);
    translate.use(locale);
  }
}
