import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HistoryService } from './services/history.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('convertitore');
  private historyService = inject(HistoryService);

  constructor() {
    // Sync any pending local history to Firestore when user logs in
    this.historyService.syncPendingOnLogin();
  }
}
