import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../../core/services/mock-api.service';
import { DEFAULT_SCHEMAS } from '../../../core/mocks/schemas.mock';
import { RequestStateService } from '../../../core/services/request-state.service';
import { FormFieldConfig, FormSchema, FormSectionConfig } from '../../../core/models/schema.model';

@Component({
  selector: 'app-schema-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schema-config-modal.component.html',
  styleUrl: './schema-config-modal.component.scss',
})
export class SchemaConfigModalComponent implements OnInit {
  private readonly mockApi = inject(MockApiService);
  private readonly requestState = inject(RequestStateService);

  isOpen = false;
  activeTab: 'visual' | 'json' = 'visual';
  selectedSchemaId = 'software-request';

  schemas: FormSchema[] = [];
  currentSchema!: FormSchema;
  jsonCode = '';
  jsonError = '';
  successMessage = '';

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Shortcuts: Ctrl+Shift+P / Cmd+Shift+P or F2
    if (
      ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'P' || event.key === 'p')) ||
      event.key === 'F2'
    ) {
      event.preventDefault();
      this.toggleModal();
    } else if (event.key === 'Escape' && this.isOpen) {
      this.closeModal();
    }
  }

  ngOnInit(): void {
    this.mockApi.schemas$.subscribe((schemas) => {
      this.schemas = JSON.parse(JSON.stringify(schemas));
      this.loadActiveSchema();
    });
  }

  toggleModal(): void {
    if (this.isOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  openModal(): void {
    this.schemas = JSON.parse(JSON.stringify(this.mockApi.currentSchemas));
    this.loadActiveSchema();
    this.isOpen = true;
    this.successMessage = '';
    this.jsonError = '';
  }

  closeModal(): void {
    this.isOpen = false;
  }

  onSelectSchema(schemaId: string): void {
    this.selectedSchemaId = schemaId;
    this.loadActiveSchema();
  }

  loadActiveSchema(): void {
    const found = this.schemas.find((s) => s.id === this.selectedSchemaId);
    if (found) {
      this.currentSchema = found;
    } else if (this.schemas.length > 0) {
      this.currentSchema = this.schemas[0];
      this.selectedSchemaId = this.currentSchema.id;
    }
    this.syncToJson();
  }

  setTab(tab: 'visual' | 'json'): void {
    if (tab === 'json') {
      this.syncToJson();
    } else if (this.activeTab === 'json') {
      this.syncFromJson();
    }
    this.activeTab = tab;
  }

  syncToJson(): void {
    this.jsonCode = JSON.stringify(this.currentSchema, null, 2);
    this.jsonError = '';
  }

  syncFromJson(): boolean {
    try {
      const parsed = JSON.parse(this.jsonCode);
      if (!parsed.id || !parsed.title || !Array.isArray(parsed.sections)) {
        this.jsonError = 'Invalid schema structure: must include id, title, and sections array.';
        return false;
      }
      this.currentSchema = parsed;
      const idx = this.schemas.findIndex((s) => s.id === parsed.id);
      if (idx >= 0) {
        this.schemas[idx] = parsed;
      }
      this.jsonError = '';
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.jsonError = `JSON syntax error: ${msg}`;
      return false;
    }
  }

  addField(section: FormSectionConfig): void {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const newField: FormFieldConfig = {
      id: newId,
      label: 'New Field',
      type: 'text',
      required: false,
    };
    section.fields.push(newField);
    this.syncToJson();
  }

  removeField(section: FormSectionConfig, index: number): void {
    section.fields.splice(index, 1);
    this.syncToJson();
  }

  addSection(): void {
    const newSecId = `section-${Date.now()}`;
    const newSection: FormSectionConfig = {
      id: newSecId,
      title: `Page ${this.currentSchema.sections.length + 1}`,
      fields: [
        {
          id: Date.now(),
          label: 'Item Name',
          type: 'text',
          required: true,
        },
      ],
    };
    this.currentSchema.sections.push(newSection);
    this.syncToJson();
  }

  removeSection(index: number): void {
    if (this.currentSchema.sections.length <= 1) {
      alert('Schema must have at least one section/page.');
      return;
    }
    this.currentSchema.sections.splice(index, 1);
    this.syncToJson();
  }

  getOptionsString(field: FormFieldConfig): string {
    return (field.options || []).join(', ');
  }

  setOptionsString(field: FormFieldConfig, value: string): void {
    field.options = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  onFieldTypeChange(field: FormFieldConfig): void {
    if (field.type === 'radio' && (!field.options || field.options.length === 0)) {
      field.options = ['Yes', 'No'];
    }
    if (field.type === 'toggle' && field.default === undefined) {
      field.default = false;
    }
    this.syncToJson();
  }

  saveChanges(): void {
    if (this.activeTab === 'json') {
      const valid = this.syncFromJson();
      if (!valid) return;
    }

    this.mockApi.updateSchema(this.currentSchema);
    this.requestState.updateActiveRequestSchema(this.currentSchema);

    this.successMessage = `Schema "${this.currentSchema.title}" saved successfully!`;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all schemas to their original defaults?')) {
      this.mockApi.resetSchemasToDefault();
      this.schemas = JSON.parse(JSON.stringify(DEFAULT_SCHEMAS));
      this.loadActiveSchema();
      this.requestState.updateActiveRequestSchema(this.currentSchema);
      this.successMessage = 'Schemas reset to original defaults!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }
}
