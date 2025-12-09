import { Routes } from '@angular/router';
import { AccessoComponent } from './components/accesso/accesso.component';
import { RegistrazioneComponent } from './components/registrazione/registrazione.component';
import { CronologiaComponent } from './components/cronologia/cronologia.component';
import { ConvertitoreFileComponent } from './components/convertitore-file/convertitore-file.component';
import { ConvertitoreUnitaComponent } from './components/convertitore-unita/convertitore-unita.component';
import { ConvertitoreValutaComponent } from './components/convertitore-valuta/convertitore-valuta.component';
import { ManipolatoreTestoComponent } from './components/manipolatore-testo/manipolatore-testo.component';
import { AssistenteCodiceComponent } from './components/assistente-codice/assistente-codice.component';
import { GeneratoreAIComponent } from './components/generatore-ai/generatore-ai.component';
import { ConvertitoreColoreComponent } from './components/convertitore-colore/convertitore-colore.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'accesso', component: AccessoComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'cronologia', component: CronologiaComponent },
  { path: 'convertitore-file', component: ConvertitoreFileComponent },
  { path: 'convertitore-unita', component: ConvertitoreUnitaComponent },
  { path: 'convertitore-valuta', component: ConvertitoreValutaComponent },
  { path: 'manipolatore-testo', component: ManipolatoreTestoComponent },
  { path: 'assistente-codice', component: AssistenteCodiceComponent },
  { path: 'generatore-ai', component: GeneratoreAIComponent },
  { path: 'convertitore-colore', component: ConvertitoreColoreComponent },
  { path: '', redirectTo: 'cronologia', pathMatch: 'full' },
];
