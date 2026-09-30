import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutosaveStatus } from '../../../../core/models/request.model';

@Component({
  selector: 'app-autosave-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autosave-status.component.html',
  styleUrl: './autosave-status.component.scss',
})
export class AutosaveStatusComponent {
  @Input() status: AutosaveStatus | null = 'idle';
}
