export type FieldType = 'text' | 'number' | 'radio' | 'toggle' | 'textarea';

export type FieldId = number | string;

export type FieldValue = string | number | boolean | null | undefined;

export interface FormFieldConfig {
  id: FieldId;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  default?: FieldValue;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  fields: FormFieldConfig[];
}

export interface FormSchema {
  id: string;
  title: string;
  sections: FormSectionConfig[];
}
