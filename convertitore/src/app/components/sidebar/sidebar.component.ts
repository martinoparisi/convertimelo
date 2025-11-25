import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="h-screen w-64 bg-slate-900/95 backdrop-blur border-r border-indigo-500/20 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      <div class="h-16 flex items-center px-6 border-b border-indigo-500/20">
        <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
          Convertimelo
        </span>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <a routerLink="/dashboard" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          <span class="font-medium">Dashboard</span>
        </a>

        <div class="pt-4 pb-2">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Converters</p>
        </div>

        <a routerLink="/file-converter" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span class="font-medium">File Converter</span>
        </a>

        <a routerLink="/unit-converter" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
          </svg>
          <span class="font-medium">Unit Converter</span>
        </a>

        <a routerLink="/currency-converter" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium">Currency Converter</span>
        </a>

        <div class="pt-4 pb-2">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</p>
        </div>

        <a routerLink="/text-manipulator" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span class="font-medium">Text Manipulator</span>
        </a>

        <a routerLink="/genkit" routerLinkActive="bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500" class="flex items-center px-4 py-3 text-gray-400 rounded-r-lg hover:bg-indigo-500/5 hover:text-indigo-300 transition-all duration-200 group">
          <svg class="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <span class="font-medium">Genkit AI</span>
        </a>
      </nav>

      <div class="p-4 border-t border-indigo-500/20">
        <button (click)="logout()" class="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
