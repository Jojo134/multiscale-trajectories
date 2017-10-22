import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCompareComponent } from './detail-compare.component';

describe('DetailCompareComponent', () => {
  let component: DetailCompareComponent;
  let fixture: ComponentFixture<DetailCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
