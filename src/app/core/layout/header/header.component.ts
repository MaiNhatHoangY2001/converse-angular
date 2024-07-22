import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageSettingComponent } from '@app/core/layout/language-setting/language-setting.component';
import { ThemeService } from '@app/shared/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LanguageSettingComponent, ToolbarModule, InputSwitchModule, FormsModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  checked = false;
  selectedTheme = 'light';

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const element = document.querySelector('.layout-topbar') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('layout-topbar-sticky');
    } else {
      element.classList.remove('layout-topbar-sticky');
    }
  }

  constructor(private themService: ThemeService) {}

  ngOnInit(): void {
    this.themService.setTheme(this.selectedTheme);
  }

  onThemeChange(check: boolean): void {
    const theme = check ? 'dark' : 'light';
    this.checked = check;
    this.selectedTheme = theme;
    this.themService.setTheme(theme);
  }
}
