import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '@app/shared/services/translation.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

interface Language {
  value: string;
  icon: string;
  label: string;
}

const LANGUAGES = [
  {
    value: 'en',
    icon: 'great-britain.png',
    label: 'English',
  },
  {
    value: 'vi',
    icon: 'vietnam.png',
    label: 'Vietnam',
  },
];

@Component({
  selector: 'app-language-setting',
  standalone: true,
  imports: [DropdownModule, FormsModule, NgIf],
  templateUrl: './language-setting.component.html',
  styleUrl: './language-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingComponent implements OnInit {
  @Input() inputClass: string | undefined;
  lang: Language[] | undefined;
  selectedLang: Language | undefined;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    const currentLanguage = this.translationService.getLanguage();
    const optionLanguage = LANGUAGES.find(lang => lang.value === currentLanguage);
    this.lang = LANGUAGES;
    this.selectedLang = optionLanguage;
  }

  handleChangeLanguage(event: DropdownChangeEvent): void {
    this.translationService.changeLanguage(event?.value?.value || 'en');
  }
}
