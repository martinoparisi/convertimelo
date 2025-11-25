import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-900 transition-colors duration-200">
      <app-navbar></app-navbar>
      
      <!-- Tab Selector -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="flex space-x-4 overflow-x-auto pb-2 border-b border-indigo-500/20">

          <a routerLink="/file-converter" 
             routerLinkActive="border-indigo-500 text-white bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border-b-2 border-transparent whitespace-nowrap">
            File
          </a>
          <a routerLink="/unit-converter" 
             routerLinkActive="border-indigo-500 text-white bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border-b-2 border-transparent whitespace-nowrap">
            Unità
          </a>
          <a routerLink="/currency-converter" 
             routerLinkActive="border-indigo-500 text-white bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border-b-2 border-transparent whitespace-nowrap">
            Valuta
          </a>
          <a routerLink="/text-manipulator" 
             routerLinkActive="border-indigo-500 text-white bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border-b-2 border-transparent whitespace-nowrap">
            Testo
          </a>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent { }
