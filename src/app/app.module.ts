import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { environment } from "../environments/environment";
import { initFirebaseBackend } from "./authUtils";
import { FakeBackendInterceptor } from "./core/helpers/fake-backend";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  NgbModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import {NgxPrintModule} from 'ngx-print';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxSpinnerModule } from "ngx-spinner";

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Select2Module } from "ng-select2-component";
import { AngularFireModule } from '@angular/fire/compat';
// firebase
import { provideFirestore, getFirestore } from "@angular/fire/firestore";

if (environment.defaultauth === "firebase") {
  initFirebaseBackend(environment.firebase);
} else {
  FakeBackendInterceptor;
}
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    NgbModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbNavModule,
    LayoutsModule,
    TranslateModule,
    BrowserAnimationsModule,
    Select2Module,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()), //add++
    provideAuth(() => getAuth()),
    AngularFireModule.initializeApp(environment.firebase),
    NgxPrintModule,
    NgxSpinnerModule
  ],schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
