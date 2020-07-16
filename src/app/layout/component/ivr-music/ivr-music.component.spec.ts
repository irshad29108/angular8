import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrMusicComponent } from './ivr-music.component';

describe('IvrMusicComponent', () => {
  let component: IvrMusicComponent;
  let fixture: ComponentFixture<IvrMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
