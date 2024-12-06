import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FillPipe } from '@app/shared/pipes/fill.pipe';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface Plan {
  name: string;
  title: string;
  subTitle: string;
  numOptions: number;
  buttonText: string;
}

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [TranslateModule, ButtonModule, CardModule, CommonModule, NgOptimizedImage, FillPipe],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanComponent {
  cardsContent = [
    {
      id: 'planFree',
      name: 'FREE',
      title: 'PLAN.FREE.TITLE',
      subTitle: 'PLAN.FREE.SUB_TITLE',
      numOptions: 6,
      buttonText: 'PLAN.FREE.BUTTON',
    },
    {
      id: 'planPro',
      name: 'PRO',
      title: 'PLAN.PRO.TITLE',
      subTitle: 'PLAN.PRO.SUB_TITLE',
      numOptions: 8,
      buttonText: 'PLAN.PRO.BUTTON',
    },
    {
      id: 'planBasic',
      name: 'BASIC',
      title: 'PLAN.BASIC.TITLE',
      subTitle: 'PLAN.BASIC.SUB_TITLE',
      numOptions: 6,
      buttonText: 'PLAN.BASIC.BUTTON',
    },
  ];

  get baseImageUrl() {
    return environment.googleStorageUrl;
  }

  identify(index: number, item: Plan) {
    return item.title;
  }

  counter(i: number) {
    return new Array(i);
  }

  optionName(planName: string, num: number): string {
    return `PLAN.${planName}.OPTION_${num + 1}`;
  }
}
