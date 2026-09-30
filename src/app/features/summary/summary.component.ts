import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestStateService } from '../../core/services/request-state.service';
import { ActiveRequest } from '../../core/models/request.model';
import { FormFieldConfig, FieldValue } from '../../core/models/schema.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit, OnDestroy {
  private readonly requestState = inject(RequestStateService);
  private readonly router = inject(Router);

  activeRequest: ActiveRequest | null = null;
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.requestState.activeRequest$.subscribe((req) => {
      this.activeRequest = req;
      if (!req) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isFieldEmpty(value: FieldValue): boolean {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  }

  getFieldDisplayValue(field: FormFieldConfig, value: FieldValue): string {
    if (this.isFieldEmpty(value)) {
      return 'not answered';
    }
    if (field.type === 'toggle') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }

  formatFieldValue(field: FormFieldConfig, value: FieldValue): string {
    return this.getFieldDisplayValue(field, value);
  }

  onCreateNewRequest(): void {
    this.requestState.reset();
    this.router.navigate(['/']);
  }
}
