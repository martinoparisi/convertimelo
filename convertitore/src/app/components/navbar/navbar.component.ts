import {
  Component,
  inject,
  signal,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginPopupComponent],
  template: `
    <nav class="bg-slate-900 sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <!-- Bigger logo, remove white border/outline -->
              <img
                class="h-16 w-auto drop-shadow-[0_0_12px_rgba(139,92,246,0.65)]"
                src="logoExtended.png"
                alt="Convertimelo"
              />
            </div>
          </div>

          <!-- Desktop Pill Selector (Hidden on Mobile) -->
          <div class="hidden md:flex flex-1 justify-center items-center">
            <div
              #navContainerDesktop
              class="relative flex bg-slate-800/50 rounded-full p-1 border border-indigo-500/10 transition-colors duration-200"
            >
              <!-- Sliding Pill Desktop -->
              <div
                #pillDesktop
                class="absolute top-1 bottom-1 bg-indigo-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                [style.left.px]="pillLeftDesktop()"
                [style.width.px]="pillWidthDesktop()"
                [class.opacity-0]="activeLinkIndex() === -1"
              ></div>

              <!-- Links Desktop -->
              <a
                *ngFor="let link of links; let i = index"
                #navItemDesktop
                [routerLink]="link.path"
                class="relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white"
                [class.text-white]="activeLinkIndex() === i"
              >
                {{ link.label }}
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <!-- History Link (icon only) -->
            <a
              routerLink="/dashboard"
              class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
            >
              <svg
                class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
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
            </a>

            <!-- Dark/Light Mode Toggle (icon only) -->
            <button
              (click)="toggleDarkMode()"
              class="!ml-0 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group"
            >
              <svg
                *ngIf="!isDarkMode()"
                class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
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
                class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
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
                  <div class="px-4 py-4 border-b border-gray-700">
                    <div class="flex items-center gap-2">
                      <span class="text-gray-400 whitespace-nowrap text-lg">Ciao,</span>
                      <input
                        id="username-input"
                        type="text"
                        [value]="
                          username() ||
                          user?.displayName ||
                          (user?.email ? user.email!.split('@')[0] : '')
                        "
                        (change)="updateUsername($event)"
                        class="bg-transparent border-b border-gray-600 text-white text-lg font-medium focus:outline-none focus:border-indigo-500 w-full pb-1 placeholder-gray-500"
                        placeholder="Il tuo nome"
                      />
                      <button
                        title="Modifica nome"
                        (click)="focusUsername()"
                        class="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    (click)="logout()"
                    class="w-full text-left block px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-2"
                  >
                    Esci
                  </button>
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

      <!-- Conversion selector bar under header (Dropdown) - Mobile Only -->
      <div class="md:hidden w-full bg-slate-900 transition-colors duration-200 pb-3">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative">
            <!-- Dropdown Button -->
            <button
              (click)="toggleConverterDropdown()"
              class="w-full flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-indigo-500/10 text-gray-300 hover:text-white transition-colors"
            >
              <span class="font-medium capitalize">
                {{ activeLinkIndex() !== -1 ? links[activeLinkIndex()].label : 'Seleziona Convertitore' }}
              </span>
              <svg
                class="w-5 h-5 transition-transform duration-200"
                [class.rotate-180]="isConverterDropdownOpen()"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              *ngIf="isConverterDropdownOpen()"
              class="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
            >
              <a
                *ngFor="let link of links; let i = index"
                [routerLink]="link.path"
                (click)="isConverterDropdownOpen.set(false)"
                class="block px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-indigo-600/20 hover:text-white capitalize"
                [class.text-indigo-400]="activeLinkIndex() === i"
                [class.bg-indigo-600/10]="activeLinkIndex() === i"
                [class.text-gray-300]="activeLinkIndex() !== i"
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
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  authService = inject(AuthService);
  private router = inject(Router);
  private historyService = inject(HistoryService);
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  private userUnsubscribe: (() => void) | null = null;

  @ViewChildren('navItemDesktop') navItemsDesktop!: QueryList<ElementRef>;
  @ViewChildren('navItemMobile') navItemsMobile!: QueryList<ElementRef>;
  @ViewChild('pillDesktop') pillDesktop!: ElementRef;
  @ViewChild('pillMobile') pillMobile!: ElementRef;
  @ViewChild('navContainerDesktop') navContainerDesktop!: ElementRef;
  @ViewChild('navContainerMobile') navContainerMobile!: ElementRef;
  private resizeObserver: ResizeObserver | null = null;
  private resizeHandler = () => this.updatePillPosition();

  links = [
    { label: 'file', path: '/file-converter' },
    { label: 'unità', path: '/unit-converter' },
    { label: 'valute', path: '/currency-converter' },
    { label: 'testo', path: '/text-manipulator' },
    { label: 'code', path: '/code-converter' },
    { label: 'colore', path: '/color-converter' },
  ];

  activeLinkIndex = signal<number>(-1);
  pillLeftDesktop = signal<number>(0);
  pillWidthDesktop = signal<number>(0);
  pillLeftMobile = signal<number>(0);
  pillWidthMobile = signal<number>(0);

  isDarkMode = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  isConverterDropdownOpen = signal<boolean>(false);
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

  ngOnInit() {
    // Listen to auth state changes
    this.authService.user$.subscribe((user) => {
      // Unsubscribe from previous user listener if any
      if (this.userUnsubscribe) {
        this.userUnsubscribe();
        this.userUnsubscribe = null;
      }

      if (user) {
        // Listen to user profile changes in real-time
        const userDoc = doc(this.firestore, 'users', user.uid);
        this.userUnsubscribe = onSnapshot(userDoc, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();

            // Update username
            if (data['username']) {
              this.username.set(data['username']);
              localStorage.setItem('username', data['username']);
            }

            // Update theme
            if (data['theme']) {
              const isDark = data['theme'] === 'dark';
              this.isDarkMode.set(isDark);
              if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              }
            }
          }
        });

        // Sync any pending history
        this.historyService.syncPendingOnLogin();
      } else {
        // Reset to local storage or defaults on logout
        const savedUsername = localStorage.getItem('username');
        this.username.set(savedUsername || '');
      }
    });
  }

  ngOnDestroy() {
    if (this.userUnsubscribe) {
      this.userUnsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.resizeHandler);
  }

  ngAfterViewInit() {
    // Update pill on route change
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updatePillPosition();
    });

    // Initial check with multiple attempts to ensure rendering is complete
    setTimeout(() => this.updatePillPosition(), 50);
    setTimeout(() => this.updatePillPosition(), 200);
    setTimeout(() => this.updatePillPosition(), 500);

    // Update on resize
    window.addEventListener('resize', this.resizeHandler);

    // Use ResizeObserver to detect layout changes
    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.run(() => {
        this.updatePillPosition();
      });
    });

    if (this.navContainerDesktop?.nativeElement) {
      this.resizeObserver.observe(this.navContainerDesktop.nativeElement);
    }
    if (this.navContainerMobile?.nativeElement) {
      this.resizeObserver.observe(this.navContainerMobile.nativeElement);
    }

    // Listen for changes in nav items
    this.navItemsDesktop.changes.subscribe(() => this.updatePillPosition());
    this.navItemsMobile.changes.subscribe(() => this.updatePillPosition());
  }

  updatePillPosition() {
    const currentUrl = this.router.url;
    const index = this.links.findIndex((link) => currentUrl.includes(link.path));

    if (index !== -1) {
      this.activeLinkIndex.set(index);

      // Update Desktop Pill
      const desktopItems = this.navItemsDesktop?.toArray();
      if (desktopItems && desktopItems[index]) {
        const element = desktopItems[index].nativeElement;
        this.pillLeftDesktop.set(element.offsetLeft);
        this.pillWidthDesktop.set(element.offsetWidth);
      }

      // Update Mobile Pill
      const mobileItems = this.navItemsMobile?.toArray();
      if (mobileItems && mobileItems[index]) {
        const element = mobileItems[index].nativeElement;
        this.pillLeftMobile.set(element.offsetLeft);
        this.pillWidthMobile.set(element.offsetWidth);
      }
    } else {
      this.activeLinkIndex.set(-1);
      this.pillWidthDesktop.set(0);
      this.pillWidthMobile.set(0);
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

  toggleConverterDropdown() {
    this.isConverterDropdownOpen.update((v) => !v);
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
        setDoc(userDoc, { username: newName }, { merge: true } as any);
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
