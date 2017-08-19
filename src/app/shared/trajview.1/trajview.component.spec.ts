import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Trajview1Component } from './trajview.component';

describe('TrajviewComponent', () => {
  let component: Trajview1Component;
  let fixture: ComponentFixture<Trajview1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Trajview1Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Trajview1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
