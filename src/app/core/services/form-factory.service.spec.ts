import { TestBed } from '@angular/core/testing';
import { FormFactoryService } from './form-factory.service';
import { FormSchema } from '../models/schema.model';

describe('FormFactoryService', () => {
  let service: FormFactoryService;

  const mockSchema: FormSchema = {
    id: 'test-schema',
    title: 'Test Schema',
    sections: [
      {
        id: 'section-1',
        title: 'Section 1',
        fields: [
          {
            id: 101,
            label: 'Required Text',
            type: 'text',
            required: true,
          },
          {
            id: 102,
            label: 'Optional Number',
            type: 'number',
            required: false,
          },
          {
            id: 103,
            label: 'Toggle Field',
            type: 'toggle',
            default: false,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create reactive FormGroup based on schema', () => {
    const formGroup = service.createFormGroup(mockSchema);
    expect(formGroup).toBeTruthy();

    const sectionGroup = formGroup.get('section-1');
    expect(sectionGroup).toBeTruthy();

    const field101 = sectionGroup?.get('101');
    expect(field101).toBeTruthy();
    expect(field101?.valid).toBeFalsy(); // Required text without initial value is invalid

    field101?.setValue('Valid value');
    expect(field101?.valid).toBeTruthy();
  });

  it('should apply initial answers if provided', () => {
    const initialAnswers = {
      101: 'Pre-filled text',
      102: 42,
      103: true,
    };

    const formGroup = service.createFormGroup(mockSchema, initialAnswers);
    const sectionGroup = formGroup.get('section-1');

    expect(sectionGroup?.get('101')?.value).toBe('Pre-filled text');
    expect(sectionGroup?.get('102')?.value).toBe(42);
    expect(sectionGroup?.get('103')?.value).toBe(true);
  });
});
