import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './features/home/home.component';
import { ThemeService } from './shared/services/theme.service';
import { TranslationService } from './shared/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
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
}
