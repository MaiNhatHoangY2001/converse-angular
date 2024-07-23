import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Errors } from '../../core/models/errors.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  imports: [NgIf, NgForOf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListErrorsComponent {
  errorList: string[] = [];

  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList
      ? Object.keys(errorList.errors || {}).map(key => `${key} ${errorList.errors[parseInt(key)]}`)
      : [];
  }
}
