import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from '@app/shared/models';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    CardModule,
    CommonModule,
    NgOptimizedImage,
    AvatarModule,
    AvatarGroupModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentComponent {
  value: number = 5;
  cardsContent = [
    {
      title: 'Mai Ngoc Long',
      img: 'chosee-us1.png',
      description: 'STUDENT.FEEDBACK_1',
      rating: 5,
    },
    {
      title: 'Dinh Tuan',
      img: 'chosee-us2.png',
      description: 'STUDENT.FEEDBACK_2',
      rating: 5,
    },
    {
      title: 'Trong Hieu',
      img: 'chosee-us3.png',
      description: 'STUDENT.FEEDBACK_3',
      rating: 5,
    },
  ];

  identify(index: number, item: Card) {
    return item.title;
  }

  get baseImageUrl() {
    return environment.GOOGLE_STORAGE_URL;
  }
}
