import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaConfigModalComponent } from './schema-config-modal.component';
import { MockApiService } from '../../../core/services/mock-api.service';
import { RequestStateService } from '../../../core/services/request-state.service';

describe('SchemaConfigModalComponent', () => {
  let component: SchemaConfigModalComponent;
  let fixture: ComponentFixture<SchemaConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaConfigModalComponent],
      providers: [MockApiService, RequestStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the schema config modal', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen).toBe(false);
  });

  it('should open and close modal on toggle', () => {
    component.openModal();
    expect(component.isOpen).toBe(true);

    component.closeModal();
    expect(component.isOpen).toBe(false);
  });

  it('should toggle on keyboard shortcut (Ctrl+Shift+P)', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'P',
      ctrlKey: true,
      shiftKey: true,
    });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  });

  it('should allow adding a new field to a section', () => {
    component.openModal();
    const section = component.currentSchema.sections[0];
    const initialFieldCount = section.fields.length;

    component.addField(section);
    expect(section.fields.length).toBe(initialFieldCount + 1);
  });
});
