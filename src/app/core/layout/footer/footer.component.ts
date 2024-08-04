import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env/environment';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ToolbarModule, SharedModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  get baseImageUrl() {
    return environment.googleStorageUrl;
  }
}
