import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SummaryComponent } from './summary.component';
import { RequestStateService } from '../../core/services/request-state.service';
import { ActiveRequest } from '../../core/models/request.model';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let activeRequestSubject: BehaviorSubject<ActiveRequest | null>;
  let mockRequestState: { activeRequest$: ReturnType<BehaviorSubject<ActiveRequest | null>['asObservable']>; reset: jest.Mock };
  let router: Router;

  const mockActiveRequest: ActiveRequest = {
    id: 'req-12345',
    schemaId: 'software-request',
    currentSectionIndex: 1,
    isSubmitted: true,
    answers: {
      1758177604: 'Slack License',
      75484637462: 5,
      4957463729: 'Slack Inc.',
      8462736152: 'USA',
    },
    schema: {
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
            { id: 6482937561, label: 'Website', type: 'text', required: false },
          ],
        },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    activeRequestSubject = new BehaviorSubject<ActiveRequest | null>(mockActiveRequest);
    mockRequestState = {
      activeRequest$: activeRequestSubject.asObservable(),
      reset: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [
        provideRouter([]),
        { provide: RequestStateService, useValue: mockRequestState },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and display active request data', () => {
    expect(component).toBeTruthy();
    expect(component.activeRequest).toEqual(mockActiveRequest);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.summary-title')?.textContent).toContain('Awesome!');
    expect(compiled.querySelector('.summary-subtitle')?.textContent).toContain('It works!');
    expect(compiled.querySelector('.btn-complete-reset')?.textContent).toContain('Complete the flow and Reset');
  });

  it('should format answered and unanswered field values correctly', () => {
    const textAnsweredField = { id: 1758177604, label: 'Item Name', type: 'text' as const, required: true };
    const textUnansweredField = { id: 6482937561, label: 'Website', type: 'text' as const, required: false };
    const toggleField = { id: 238918239, label: 'Shipping', type: 'toggle' as const, default: false };

    expect(component.getFieldDisplayValue(textAnsweredField, 'Slack License')).toBe('Slack License');
    expect(component.getFieldDisplayValue(textUnansweredField, undefined)).toBe('not answered');
    expect(component.getFieldDisplayValue(toggleField, true)).toBe('Yes');
    expect(component.getFieldDisplayValue(toggleField, false)).toBe('No');
  });

  it('should call reset and navigate to root on reset button click', () => {
    component.onCreateNewRequest();
    expect(mockRequestState.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to root if activeRequest is null on init', () => {
    activeRequestSubject.next(null);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
