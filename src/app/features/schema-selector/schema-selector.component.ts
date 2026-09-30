import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormSchema } from '../../core/models/schema.model';
import { MockApiService } from '../../core/services/mock-api.service';
import { RequestStateService } from '../../core/services/request-state.service';

@Component({
  selector: 'app-schema-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schema-selector.component.html',
  styleUrl: './schema-selector.component.scss',
})
export class SchemaSelectorComponent implements OnInit {
  private readonly mockApi = inject(MockApiService);
  private readonly requestState = inject(RequestStateService);
  private readonly router = inject(Router);

  schemas$!: Observable<FormSchema[]>;
  isCreating = false;
  selectedSchemaId: string | null = null;

  ngOnInit(): void {
    this.schemas$ = this.mockApi.getSchemas();
  }

  selectSchema(schemaId: string): void {
    this.selectedSchemaId = schemaId;
  }

  onStart(): void {
    if (!this.selectedSchemaId || this.isCreating) return;

    this.isCreating = true;

    this.requestState.startNewRequest(this.selectedSchemaId).subscribe({
      next: (activeReq) => {
        this.isCreating = false;
        this.router.navigate(['/request', activeReq.id, 'section', 0]);
      },
      error: (err: unknown) => {
        this.isCreating = false;
        console.error('[SchemaSelector] Failed to start request:', err);
        alert('Failed to initialize request. Please try again.');
      },
    });
  }
}
