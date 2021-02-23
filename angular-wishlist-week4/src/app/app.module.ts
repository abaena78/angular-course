import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injectable, InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environment

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import {
  DestinosViajesState,
  reducerDestinosViajes,
  initializeDestinosViajesState,
  DestinosViajesEffects,
  InitMyDataAction} from './models/destinos-viajes-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasComponent } from './reservas/reservas.component';
import { ReservasApiClientService } from './reservas/reservas-api-client.service';
import { HttpClient, HttpClientModule, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Dexie } from 'dexie';
import { DestinoViaje } from './models/destino-viaje.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive'

// init routing
export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponent },
  { path: 'mas-info', component: VuelosMasInfoComponent },
  { path: ':id', component: VuelosDetalleComponent },
];

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ UsuarioLogueadoGuard ]
  },
  {
    path: 'vuelos',
    component: VuelosComponent,
    canActivate: [ UsuarioLogueadoGuard ],
    children: childrenRoutesVuelos
  }
];

// app config ************************************************
export interface AppConfig {
  apiEndpoint: String;
}
const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// fin app config **************************************

// redux init
//estado global de la aplicacion
export interface AppState {
  destinos: DestinosViajesState;
}
//reducers globales de la aplicacion
const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
}
// inicializacion
let reducersInitialState = {
  destinos: initializeDestinosViajesState()
}
// redux fin init

// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any>  {
  return () => appLoadService.intializeDestinosViajesState();
}

@Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) { }
  async intializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

// fin app init

// dexie db
export class Translation {
  constructor(public id: number, public lang: string, public key: string, public value: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor () {
      super('MyDatabase');
      this.version(1).stores({
        destinos: '++id, nombre, imagenUrl'
      });
      this.version(2).stores({
        destinos: '++id, nombre, imagenUrl',
        translations: '++id, lang, key, value'
      });
  }
}

export const db = new MyDatabase();
// fin dexie db

// i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
                      .where('lang')
                      .equals(lang)
                      .toArray()
                      .then(results => {
                                        if (results.length === 0) {
                                          return this.http
                                            .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang=' + lang)
                                            .toPromise()
                                            .then(apiResults => {
                                              db.translations.bulkAdd(apiResults);
                                              return apiResults;
                                            });
                                        }
                                        return results;
                                      }).then((traducciones) => {
                                        console.log('traducciones cargadas:');
                                        console.log(traducciones);
                                        return traducciones;
                                      }).then((traducciones) => {
                                        return traducciones.map((t) => ({ [t.key]: t.value}));
                                      });
    /*
    return from(promise).pipe(
      map((traducciones) => traducciones.map((t) => { [t.key]: t.value}))
    );
    */
   return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponent,
    ReservasComponent,
    EspiameDirective,
    TrackearClickDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {initialState: reducersInitialState }),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
    }),
    NgxMapboxGLModule,
    BrowserAnimationsModule
  ],
  providers: [
    MyDatabase,
    DestinosApiClient,
    ReservasApiClientService,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
