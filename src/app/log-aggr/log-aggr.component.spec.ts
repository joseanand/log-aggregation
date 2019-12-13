import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAggrComponent } from './log-aggr.component';

describe('LogAggrComponent', () => {
  let component: LogAggrComponent;
  let fixture: ComponentFixture<LogAggrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogAggrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAggrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
