import { NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FooterComponent } from '@app/core/layout/footer/footer.component';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { LanguageSettingComponent } from '@app/core/layout/language-setting/language-setting.component';
import { ThemeService } from '@app/shared/services/theme.service';
import { TranslationService } from '@app/shared/services/translation.service';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ChooseUsComponent } from './components/choose-us/choose-us.component';
import { LatestWorkComponent } from './components/latest-work/latest-work.component';
import { CourseComponent } from './components/course/course.component';

interface Icon {
  alt: string;
  img: string;
  link: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    HeaderComponent,
    TranslateModule,
    NgFor,
    ButtonModule,
    LanguageSettingComponent,
    ToolbarModule,
    ChooseUsComponent,
    CourseComponent,
    LatestWorkComponent,
    FooterComponent,
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  listIcon = [
    { alt: 'github', img: 'assets/img/github.png', link: 'https://github.com/MaiNhatHoangY2001' },
    { alt: 'linked', img: 'assets/img/linked.png', link: '#' },
    { alt: 'google', img: 'assets/img/google.png', link: '#' },
    { alt: 'facebook', img: 'assets/img/facebook.png', link: '#' },
  ];

  constructor(
    translationService: TranslationService,
    private themeService: ThemeService,
  ) {
    translationService.initLanguage();
  }

  ngOnInit(): void {
    this.themeService.initTheme();
  }

  get theme() {
    return this.themeService.getTheme();
  }

  get baseImageUrl() {
    return environment.GOOGLE_STORAGE_URL;
  }

  identify(index: number, item: Icon) {
    return item.alt;
  }
}
