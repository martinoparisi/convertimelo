import { Component, inject, signal, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginPopupComponent],
  template: `
    <nav
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-indigo-500/30 sticky top-0 z-50 transition-all duration-300"
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
              class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
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
              <span class="inline">Cronologia</span>
            </a>


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
                    <div class="flex items-center gap-2">
                      <p class="text-sm text-white font-medium">
                        Ciao {{ username() || user?.displayName || (user?.email ? user.email!.split('@')[0] : '') }}!
                      </p>
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

      <!-- Conversion selector bar under header (Sliding Pill) -->
      <div class="w-full bg-white/90 dark:bg-slate-900/90 border-t border-gray-200 dark:border-indigo-500/20 backdrop-blur-sm transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative flex justify-center py-3">
            <div class="relative flex bg-gray-100/50 dark:bg-slate-800/50 rounded-full p-1 border border-gray-200 dark:border-indigo-500/10 transition-colors duration-200">
              <!-- Sliding Pill -->
              <div
                #pill
                class="absolute top-1 bottom-1 bg-indigo-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                [style.left.px]="pillLeft()"
                [style.width.px]="pillWidth()"
                [class.opacity-0]="activeLinkIndex() === -1"
              ></div>

              <!-- Links -->
              <a
                *ngFor="let link of links; let i = index"
                #navItem
                [routerLink]="link.path"
                (click)="setActive(i)"
                class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                [class.text-white]="activeLinkIndex() === i"
                [class.text-gray-600]="activeLinkIndex() !== i"
                [class.dark:text-gray-400]="activeLinkIndex() !== i"
                [class.hover:text-gray-900]="activeLinkIndex() !== i"
                [class.dark:hover:text-gray-200]="activeLinkIndex() !== i"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu removed (use selector bar below header) -->
    </nav>

    <app-login-popup *ngIf="showLoginPopup" (closePopup)="closeLoginPopup()"></app-login-popup>
  `,
  styles: [],
})
export class NavbarComponent implements AfterViewInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private historyService = inject(HistoryService);
  private firestore = inject(Firestore);

  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;
  @ViewChild('pill') pill!: ElementRef;

  links = [
    { label: 'immagine', path: '/file-converter' },
    { label: 'unità', path: '/unit-converter' },
    { label: 'valute', path: '/currency-converter' },
    { label: 'testo', path: '/text-manipulator' }
  ];

  activeLinkIndex = signal<number>(-1);
  pillLeft = signal<number>(0);
  pillWidth = signal<number>(0);

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
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username.set(savedUsername);
    }
  }

  ngAfterViewInit() {
    // Update pill on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePillPosition();
    });

    // Initial check (give time for rendering)
    setTimeout(() => this.updatePillPosition(), 100);

    // Update on resize
    window.addEventListener('resize', () => this.updatePillPosition());
  }

  setActive(index: number) {
    this.activeLinkIndex.set(index);
    this.updatePillPosition();
  }

  updatePillPosition() {
    const currentUrl = this.router.url;
    const index = this.links.findIndex(link => currentUrl.includes(link.path));

    if (index !== -1) {
      this.activeLinkIndex.set(index);
      const items = this.navItems?.toArray();
      if (items && items[index]) {
        const element = items[index].nativeElement;
        // Calculate position relative to the container
        // We need the offsetLeft and offsetWidth
        this.pillLeft.set(element.offsetLeft);
        this.pillWidth.set(element.offsetWidth);
      }
    } else {
      this.activeLinkIndex.set(-1);
      this.pillWidth.set(0);
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



  async logout() {
    await this.authService.logout();
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
