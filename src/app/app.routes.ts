import { Routes } from '@angular/router';
import { SchemaSelectorComponent } from './features/schema-selector/schema-selector.component';
import { DynamicFormComponent } from './features/dynamic-form/dynamic-form.component';
import { SummaryComponent } from './features/summary/summary.component';
import { requestActiveGuard } from './core/guards/request-active.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SchemaSelectorComponent,
  },
  {
    path: 'request/:requestId/section/:sectionIndex',
    component: DynamicFormComponent,
    canActivate: [requestActiveGuard],
  },
  {
    path: 'request/:requestId/summary',
    component: SummaryComponent,
    canActivate: [requestActiveGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
