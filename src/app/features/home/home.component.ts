import { NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '@app/core/layout/footer/footer.component';
import { HeaderComponent } from '@app/core/layout/header/header.component';
import { LanguageSettingComponent } from '@app/core/layout/language-setting/language-setting.component';
import { JourneyComponent } from '@app/features/home/components/journey/journey.component';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ChooseUsComponent } from './components/choose-us/choose-us.component';
import { CourseComponent } from './components/course/course.component';
import { PlanComponent } from './components/plan/plan.component';
import { StudentComponent } from './components/student/student.component';

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
    JourneyComponent,
    NgOptimizedImage,
    StudentComponent,
    PlanComponent,
    FooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  get baseImageUrl() {
    return environment.googleStorageUrl;
  }
}
