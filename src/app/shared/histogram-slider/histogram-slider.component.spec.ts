import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramSliderComponent } from './histogram-slider.component';

describe('HistogramSliderComponent', () => {
  let component: HistogramSliderComponent;
  let fixture: ComponentFixture<HistogramSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
