import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { PluginModules } from './module.service';
import { TelemetryService, EventService, FrameworkModule, TabsPage } from 'sunbird';
import { Globalization } from '@ionic-native/globalization';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicImageLoader, ImageLoader, ImageLoaderConfig } from "ionic-image-loader";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FrameworkModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicImageLoader.forRoot(),
    ...PluginModules
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    Globalization,
    AppVersion,
    SocialSharing,
    ImageLoader,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {

  constructor(translate: TranslateService, 
    private eventService: EventService, 
    private events: Events, 
    private imageConfig: ImageLoaderConfig) {
    translate.setDefaultLang('en');

    this.registerForEvent();
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;
  }


  registerForEvent() {
    this.eventService.register((response) => {
      // console.log("Event : " + response);
      this.events.publish('genie.event', response);
    }, (error) => {
      // console.log("Event : " + error);
    });
  }
}


export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
