import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Convertimelo';
  activeTab = 'image';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
