import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(
    private config: PrimeNGConfig,
    private translate: TranslateService,
  ) {}

  initLanguage(): void {
    this.translate.addLangs(['en', 'vi']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.getLanguage());
    this.translate.get('primeng').subscribe((res) => this.config.setTranslation(res));
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  getLanguage(): string {
    const browserLang = this.translate.getBrowserLang() ?? '';
    return RegExp(/en|vi/).exec(browserLang) ? browserLang : 'en';
  }
}
