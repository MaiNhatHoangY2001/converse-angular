import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '@app/shared/models';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CardModule, TranslateModule, CommonModule, NgOptimizedImage],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent {
  cardsContent = [
    {
      title: 'COURSE.ITEM.TITLE_1',
      img: 'course-1.png',
    },
    {
      title: 'COURSE.ITEM.TITLE_2',
      img: 'course-2.png',
    },
    {
      title: 'COURSE.ITEM.TITLE_3',
      img: 'course-3.png',
    },
    {
      title: 'COURSE.ITEM.TITLE_4',
      img: 'course-4.png',
    },
    {
      title: 'COURSE.ITEM.TITLE_5',
      img: 'course-5.png',
    },
    {
      title: 'COURSE.ITEM.TITLE_6',
      img: 'course-6.png',
    },
  ];

  identify(index: number, item: Card) {
    return item.title;
  }

  get baseImageUrl() {
    return environment.googleStorageUrl;
  }
}
