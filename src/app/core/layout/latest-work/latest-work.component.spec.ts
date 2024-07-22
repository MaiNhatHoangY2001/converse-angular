import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestWorkComponent } from './latest-work.component';

describe('LatestWorkComponent', () => {
  let component: LatestWorkComponent;
  let fixture: ComponentFixture<LatestWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestWorkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
