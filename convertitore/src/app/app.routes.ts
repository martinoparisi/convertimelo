import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileConverterComponent } from './components/file-converter/file-converter.component';
import { UnitConverterComponent } from './components/unit-converter/unit-converter.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { TextManipulatorComponent } from './components/text-manipulator/text-manipulator.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: MainLayoutComponent,
        // canActivate: [authGuard], // Made optional as requested
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'file-converter', component: FileConverterComponent },
            { path: 'unit-converter', component: UnitConverterComponent },
            { path: 'currency-converter', component: CurrencyConverterComponent },
            { path: 'text-manipulator', component: TextManipulatorComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
