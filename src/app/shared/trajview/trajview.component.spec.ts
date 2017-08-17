import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajviewComponent } from './trajview.component';

describe('TrajviewComponent', () => {
  let component: TrajviewComponent;
  let fixture: ComponentFixture<TrajviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
