import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoginPopupComponent],
  template: `
    <nav
      class="bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/30 sticky top-0 z-50 transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <!-- Bigger logo, remove white border/outline -->
              <img
                class="h-16 w-auto drop-shadow-[0_0_12px_rgba(139,92,246,0.65)]"
                src="assets/logoExtended.png"
                alt="Convertimelo"
              />
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- History Link (Always visible) -->
            <a
              routerLink="/dashboard"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
            >
              <svg
                class="h-5 w-5 mr-1 text-indigo-400 group-hover:text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="hidden sm:inline">Cronologia</span>
            </a>
            <button
              (click)="clearHistory()"
              title="Cancella cronologia"
              class="text-red-400 hover:text-red-300 p-2 rounded-md"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
            </button>

            <!-- Dark/Light Mode Toggle -->
            <button
              (click)="toggleDarkMode()"
              class="p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <svg
                *ngIf="!isDarkMode()"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                *ngIf="isDarkMode()"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- User Profile / Login -->
            <ng-container *ngIf="authService.user$ | async as user; else loginButton">
              <div class="relative ml-3">
                <div>
                  <button
                    (click)="toggleProfileMenu()"
                    type="button"
                    class="bg-slate-800 flex text-sm rounded-full focus:outline-none"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div
                      class="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600 text-white font-bold"
                    >
                      {{ user.email?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                  </button>
                </div>

                <!-- Profile Dropdown -->
                <div
                  *ngIf="isProfileMenuOpen()"
                  class="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                >
                  <div class="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <div>
                      <p class="text-sm text-white font-medium">
                        Ciao
                        {{
                          username() ||
                            user?.displayName ||
                            (user?.email ? user.email.split('@')[0] : '')
                        }}!
                      </p>
                      <p class="text-sm text-gray-400 truncate">{{ user?.email }}</p>
                    </div>
                    <button
                      title="Modifica nome"
                      (click)="focusUsername()"
                      class="text-indigo-400 hover:text-indigo-300 p-2 rounded"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536M9 11l6-6L7 3l-4 4 6 4z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="px-4 py-2">
                    <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1"
                      >Username</label
                    >
                    <input
                      id="username-input"
                      type="text"
                      [value]="username()"
                      (change)="updateUsername($event)"
                      class="w-full bg-slate-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Il tuo nome"
                    />
                  </div>

                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-2"
                    (click)="logout()"
                    >Esci</a
                  >
                </div>
              </div>
            </ng-container>

            <ng-template #loginButton>
              <button
                (click)="openLoginPopup()"
                class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              >
                Accedi
              </button>
            </ng-template>

            <!-- Removed mobile hamburger; conversion selector will be shown below header -->
          </div>
        </div>
      </div>

      <!-- Conversion selector bar under header (pills) -->
      <div class="w-full bg-slate-900/70 border-t border-indigo-500/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex gap-3 py-3 justify-center">
            <a
              routerLink="/file-converter"
              class="px-4 py-2 rounded-full bg-slate-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition"
              >immagine</a
            >
            <a
              routerLink="/unit-converter"
              class="px-4 py-2 rounded-full bg-slate-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition"
              >unità</a
            >
            <a
              routerLink="/currency-converter"
              class="px-4 py-2 rounded-full bg-slate-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition"
              >valute</a
            >
            <a
              routerLink="/text-manipulator"
              class="px-4 py-2 rounded-full bg-slate-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition"
              >testo</a
            >
          </div>
        </div>
      </div>

      <!-- Mobile menu removed (use selector bar below header) -->
    </nav>

    <app-login-popup *ngIf="showLoginPopup" (closePopup)="closeLoginPopup()"></app-login-popup>
  `,
  styles: [],
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private historyService = inject(HistoryService);

  isDarkMode = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  isProfileMenuOpen = signal<boolean>(false);
  showLoginPopup = false;
  username = signal<string>('');

  constructor() {
    // Check system preference or saved preference
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    }

    // Load username if exists
    // In a real app, this would come from the User object or DB
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username.set(savedUsername);
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update((v) => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Persist user preference if logged in
    const user = this.authService.auth.currentUser;
    if (user) {
      try {
        const userDoc = doc(this.firestore, 'users', user.uid);
        setDoc(userDoc, { theme: this.isDarkMode() ? 'dark' : 'light' }, { merge: true } as any);
      } catch (err) {
        console.error('Failed saving theme preference', err);
      }
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen.update((v) => !v);
  }

  openLoginPopup() {
    this.showLoginPopup = true;
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
  }

  updateUsername(event: any) {
    const newName = event.target.value;
    this.username.set(newName);
    localStorage.setItem('username', newName);
    // Save to DB if user logged in
    const user = this.authService.auth.currentUser;
    if (user) {
      try {
        const userDoc = doc(this.firestore, 'users', user.uid);
        setDoc(userDoc, { username: newName });
      } catch (err) {
        console.error('Failed to save username to Firestore', err);
      }
    }
  }

  focusUsername() {
    const el = document.getElementById('username-input') as HTMLInputElement | null;
    if (el) el.focus();
  }

  async clearHistory() {
    if (
      !confirm('Sei sicuro di voler cancellare tutta la cronologia? Questa azione è irreversibile.')
    )
      return;
    await this.historyService.clearHistoryForCurrentUser();
  }

  async logout() {
    await this.authService.logout();
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
