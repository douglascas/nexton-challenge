import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DynamicFormComponent } from './dynamic-form.component';
import { RequestStateService } from '../../core/services/request-state.service';
import { ActiveRequest, AutosaveStatus } from '../../core/models/request.model';
import { FormSchema } from '../../core/models/schema.model';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let router: Router;

  let activeRequestSubject: BehaviorSubject<ActiveRequest | null>;
  let saveStatusSubject: BehaviorSubject<AutosaveStatus>;
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let mockRequestStateService: {
    activeRequest$: ReturnType<BehaviorSubject<ActiveRequest | null>['asObservable']>;
    saveStatus$: ReturnType<BehaviorSubject<AutosaveStatus>['asObservable']>;
    currentForm: FormGroup | null;
    setSectionIndex: jest.Mock;
    submitActiveRequest: jest.Mock;
  };

  const mockSchema: FormSchema = {
    id: 'software-request',
    title: 'Software Request',
    sections: [
      {
        id: 'requested-item',
        title: 'Requested Item',
        fields: [
          { id: 1758177604, label: 'Item Name', type: 'text', required: true },
          { id: 75484637462, label: 'Quantity', type: 'number', required: true },
        ],
      },
      {
        id: 'vendor-info',
        title: 'Vendor Information',
        fields: [
          { id: 4957463729, label: 'Vendor Name', type: 'text', required: true },
          { id: 8462736152, label: 'Vendor Location', type: 'radio', required: true, options: ['USA', 'UK', 'Other'] },
        ],
      },
    ],
  };

  const mockActiveRequest: ActiveRequest = {
    id: 'req-999',
    schemaId: 'software-request',
    schema: mockSchema,
    answers: {
      1758177604: 'IntelliJ License',
      75484637462: 2,
      4957463729: '',
      8462736152: '',
    },
    currentSectionIndex: 0,
    isSubmitted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createMockForm = () => {
    return new FormGroup({
      'requested-item': new FormGroup({
        '1758177604': new FormControl('IntelliJ License', Validators.required),
        '75484637462': new FormControl(2, Validators.required),
      }),
      'vendor-info': new FormGroup({
        '4957463729': new FormControl('', Validators.required),
        '8462736152': new FormControl('', Validators.required),
      }),
    });
  };

  beforeEach(async () => {
    activeRequestSubject = new BehaviorSubject<ActiveRequest | null>(mockActiveRequest);
    saveStatusSubject = new BehaviorSubject<AutosaveStatus>('idle');
    paramMapSubject = new BehaviorSubject(convertToParamMap({ requestId: 'req-999', sectionIndex: '0' }));

    mockRequestStateService = {
      activeRequest$: activeRequestSubject.asObservable(),
      saveStatus$: saveStatusSubject.asObservable(),
      currentForm: createMockForm(),
      setSectionIndex: jest.fn(),
      submitActiveRequest: jest.fn().mockReturnValue(of({ success: true, requestId: 'req-999' })),
    };

    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: RequestStateService, useValue: mockRequestStateService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and display the first page and its fields', () => {
    expect(component).toBeTruthy();
    expect(component.currentSectionIndex).toBe(0);
    expect(component.isFirstStep).toBe(true);
    expect(component.isLastStep).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-main-title')?.textContent).toContain('Page 1');
    const fields = compiled.querySelectorAll('app-dynamic-field');
    expect(fields.length).toBe(2);
  });

  it('should navigate to next section when current section is valid', () => {
    component.onNext();
    expect(router.navigate).toHaveBeenCalledWith(['/request', 'req-999', 'section', 1]);
    expect(component.hasValidationError).toBe(false);
  });

  it('should block navigation and flag validation error when current section is invalid', () => {
    // Invalidate a control in requested-item
    const control = mockRequestStateService.currentForm?.get('requested-item.1758177604');
    control?.setValue('');

    component.onNext();

    expect(component.hasValidationError).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();

    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.alert-error');
    expect(alert).toBeTruthy();
  });

  it('should navigate to previous section on onPrevious call', () => {
    paramMapSubject.next(convertToParamMap({ requestId: 'req-999', sectionIndex: '1' }));
    fixture.detectChanges();

    expect(component.currentSectionIndex).toBe(1);
    expect(component.isFirstStep).toBe(false);

    component.onPrevious();
    expect(router.navigate).toHaveBeenCalledWith(['/request', 'req-999', 'section', 0]);
  });

  it('should submit request on final page when form is valid and navigate to summary', () => {
    // Fill all controls to be valid
    mockRequestStateService.currentForm?.get('vendor-info.4957463729')?.setValue('JetBrains');
    mockRequestStateService.currentForm?.get('vendor-info.8462736152')?.setValue('USA');

    paramMapSubject.next(convertToParamMap({ requestId: 'req-999', sectionIndex: '1' }));
    fixture.detectChanges();

    expect(component.isLastStep).toBe(true);

    component.onSubmit();

    expect(mockRequestStateService.submitActiveRequest).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/request', 'req-999', 'summary']);
  });

  it('should handle submit failure without crashing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockRequestStateService.submitActiveRequest.mockReturnValue(throwError(() => new Error('Submit failed')));
    mockRequestStateService.currentForm?.get('vendor-info.4957463729')?.setValue('JetBrains');
    mockRequestStateService.currentForm?.get('vendor-info.8462736152')?.setValue('USA');

    paramMapSubject.next(convertToParamMap({ requestId: 'req-999', sectionIndex: '1' }));
    fixture.detectChanges();

    component.onSubmit();

    expect(component.isSubmitting).toBe(false);
    consoleSpy.mockRestore();
  });
});
