import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageSettingComponent } from '@app/core/layout/language-setting/language-setting.component';
import { ThemeService } from '@app/shared/services/theme.service';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';

interface Theme {
  value: string;
  icon: string;
  label: string;
}

const THEME_ITEMS = [
  {
    value: 'light',
    icon: 'pi pi-sun',
    label: 'SETTING.THEME.LIGHT',
  },
  {
    value: 'dark',
    icon: 'pi pi-moon',
    label: 'SETTING.THEME.DARK',
  },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LanguageSettingComponent,
    ToolbarModule,
    InputSwitchModule,
    FormsModule,
    ButtonModule,
    TranslateModule,
    DividerModule,
    MenuModule,
    CommonModule,
    DialogModule,
    DropdownModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  checked = false;
  selectedTheme = THEME_ITEMS[0];
  menuItems: MenuItem[] | undefined;
  themeItems: Theme[] | undefined;
  isShowDialog = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const element = document.querySelector('.layout-topbar') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('layout-topbar-sticky');
    } else {
      element.classList.remove('layout-topbar-sticky');
    }
  }

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const theme = this.themeService.getTheme();
    this.checked = theme === THEME_ITEMS[1].value;
    this.themeItems = THEME_ITEMS;
    this.selectedTheme = THEME_ITEMS.find(tempTheme => tempTheme.value === theme) || THEME_ITEMS[0];
    this.menuItems = this.initalMenuItem();
  }

  get baseImageUrl() {
    return environment.GOOGLE_STORAGE_URL;
  }

  initalMenuItem() {
    return [
      {
        label: 'BUTTON.LOGIN',
        icon: 'pi pi-sign-in',
        command: () => {
          this.handleLogin();
        },
      },
      {
        label: 'BUTTON.REGISTER',
        icon: 'pi pi-user-plus',
        command: () => {
          this.handleRegister();
        },
      },
      {
        separator: true,
      },
      {
        label: 'BUTTON.SETTING',
        icon: 'pi pi-cog',
        command: () => {
          this.isShowDialog = true;
        },
      },
    ];
  }

  onThemeChange(check: boolean): void {
    const theme = check ? THEME_ITEMS[1] : THEME_ITEMS[0];
    this.checked = check;
    this.selectedTheme = theme;
    this.themeService.setTheme(theme.value);
  }

  onThemeChangeDropDown(event: DropdownChangeEvent): void {
    const theme = event?.value;
    this.checked = !this.checked;
    this.selectedTheme = theme;
    this.themeService.setTheme(theme.value);
  }

  handleLogin(): void {
    console.log('login');
  }

  handleRegister(): void {}
}
