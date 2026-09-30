import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SchemaSelectorComponent } from './schema-selector.component';
import { MockApiService } from '../../core/services/mock-api.service';
import { FormSchema } from '../../core/models/schema.model';

describe('SchemaSelectorComponent', () => {
  let component: SchemaSelectorComponent;
  let fixture: ComponentFixture<SchemaSelectorComponent>;
  let mockApiService: { getSchemas: jest.Mock; createRequest: jest.Mock };

  const mockSchemas: FormSchema[] = [
    {
      id: 'software-request',
      title: 'Software Request',
      sections: [],
    },
    {
      id: 'hardware-request',
      title: 'Hardware Request',
      sections: [],
    },
  ];

  beforeEach(async () => {
    mockApiService = {
      getSchemas: jest.fn().mockReturnValue(of(mockSchemas)),
      createRequest: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SchemaSelectorComponent],
      providers: [
        provideRouter([]),
        { provide: MockApiService, useValue: mockApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load schemas', () => {
    expect(component).toBeTruthy();
    const title = fixture.nativeElement.querySelector('.selector-title');
    expect(title?.textContent).toContain('What do you need to purchase?');
  });

  it('should render pill buttons for each schema', () => {
    const pills = fixture.nativeElement.querySelectorAll('.schema-pill');
    expect(pills.length).toBe(2);
    expect(pills[0].textContent).toContain('Software');
    expect(pills[1].textContent).toContain('Hardware');
  });

  it('should select schema when pill is clicked', () => {
    const pills = fixture.nativeElement.querySelectorAll('.schema-pill');
    pills[0].click();
    fixture.detectChanges();

    expect(component.selectedSchemaId).toBe('software-request');
    expect(pills[0].classList.contains('selected')).toBe(true);
  });
});
