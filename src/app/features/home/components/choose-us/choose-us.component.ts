import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '@app/shared/models';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-choose-us',
  standalone: true,
  imports: [TranslateModule, ButtonModule, CardModule, CommonModule, NgOptimizedImage],
  templateUrl: './choose-us.component.html',
  styleUrl: './choose-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseUsComponent {
  cardsContent = [
    {
      title: 'CHOOSE_US.ITEM.TITLE_1',
      img: 'chosee-us1.png',
      description: 'CHOOSE_US.ITEM.DESC_1',
    },
    {
      title: 'CHOOSE_US.ITEM.TITLE_2',
      img: 'chosee-us2.png',
      description: 'CHOOSE_US.ITEM.DESC_2',
    },
    {
      title: 'CHOOSE_US.ITEM.TITLE_3',
      img: 'chosee-us3.png',
      description: 'CHOOSE_US.ITEM.DESC_3',
    },
    {
      title: 'CHOOSE_US.ITEM.TITLE_4',
      img: 'chosee-us4.png',
      description: 'CHOOSE_US.ITEM.DESC_4',
    },
  ];

  identify(index: number, item: Card) {
    return item.title;
  }

  get baseImageUrl() {
    return environment.googleStorageUrl;
  }
}
