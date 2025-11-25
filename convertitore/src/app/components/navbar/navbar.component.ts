import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/30 sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-10 w-auto drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" src="assets/logoExtended.png" alt="Convertimelo">
            </div>
            <!-- Navigation links removed from here -->
          </div>
          <div class="flex items-center">
            <!-- Dark Mode Toggle -->
            <!-- Dark Mode Toggle (Removed as we are enforcing dark theme) -->
            <!-- Profile Dropdown -->

            <!-- Profile Dropdown -->
            <div class="ml-3 relative hidden sm:block">
              <div class="flex items-center space-x-3">
                <!-- History Link -->
                <a routerLink="/dashboard" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cronologia
                </a>
                <span class="text-sm font-medium text-gray-300">{{ (authService.user$ | async)?.email }}</span>
                <button (click)="logout()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  Esci
                </button>
              </div>
            </div>

            <!-- Mobile menu button -->
            <div class="-mr-2 flex items-center sm:hidden">
              <button (click)="toggleMobileMenu()" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg [class.hidden]="isMobileMenuOpen()" [class.block]="!isMobileMenuOpen()" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg [class.hidden]="!isMobileMenuOpen()" [class.block]="isMobileMenuOpen()" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="sm:hidden" id="mobile-menu" *ngIf="isMobileMenuOpen()">
        <div class="pt-2 pb-3 space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" [routerLinkActiveOptions]="{exact: true}" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Dashboard</a>
          <a routerLink="/file-converter" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">File</a>
          <a routerLink="/unit-converter" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Unità</a>
          <a routerLink="/currency-converter" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Valuta</a>
          <a routerLink="/text-manipulator" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Testo</a>
          <a routerLink="/genkit" routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:text-white" class="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">AI Gen</a>
        </div>
        <div class="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center px-4">
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800 dark:text-white">{{ (authService.user$ | async)?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button (click)="logout()" class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              Esci
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  isDarkMode = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);

  constructor() {
    // Check system preference or saved preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
