import { FieldId, FieldValue, FormSchema } from './schema.model';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'retrying';

export type RequestAnswers = Record<FieldId, FieldValue>;

export interface ActiveRequest {
  id: string;
  schemaId: string;
  schema: FormSchema;
  answers: RequestAnswers;
  currentSectionIndex: number;
  isSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
