import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceOfContractComponent } from './acceptance-of-contract.component';

describe('AcceptanceOfContractComponent', () => {
  let component: AcceptanceOfContractComponent;
  let fixture: ComponentFixture<AcceptanceOfContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceOfContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptanceOfContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
