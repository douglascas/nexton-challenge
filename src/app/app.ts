import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SchemaConfigModalComponent } from './shared/components/schema-config-modal/schema-config-modal.component';

@Component({
  imports: [RouterModule, RouterOutlet, SchemaConfigModalComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
