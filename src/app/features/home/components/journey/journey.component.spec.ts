import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyComponent } from './journey.component';

describe('JourneyComponent', () => {
  let component: JourneyComponent;
  let fixture: ComponentFixture<JourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
