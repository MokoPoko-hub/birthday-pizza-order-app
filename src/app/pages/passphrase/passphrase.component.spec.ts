import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassphraseComponent } from './passphrase.component';

describe('PassphraseComponent', () => {
  let component: PassphraseComponent;
  let fixture: ComponentFixture<PassphraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassphraseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
