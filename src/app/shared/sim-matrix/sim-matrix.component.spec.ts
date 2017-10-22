import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimMatrixComponent } from './sim-matrix.component';

describe('SimMatrixComponent', () => {
  let component: SimMatrixComponent;
  let fixture: ComponentFixture<SimMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
