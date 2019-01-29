import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Events, IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PluginModules } from './module.service';
import { EventService, FrameworkModule, TabsPage } from 'sunbird';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ImageLoader, ImageLoaderConfig, IonicImageLoader } from 'ionic-image-loader';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { AppGlobalService } from '../service/app-global.service';
import { CourseUtilService } from '../service/course-util.service';
import { UpgradePopover } from '../pages/upgrade/upgrade-popover';
import { TelemetryGeneratorService } from '../service/telemetry-generator.service';
import { QRScannerResultHandler } from '../pages/qrscanner/qrscanresulthandler.service';
import { CommonUtilService } from '../service/common-util.service';
import { BroadcastComponent } from '../component/broadcast/broadcast';
import { LogoutHandlerService } from '@app/service/handlers/logout-handler.service';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';
import { SunbirdSdk } from 'sunbird-sdk';

export const createTranslateLoader = (httpClient: HttpClient) => {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
};


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    UpgradePopover,
    BroadcastComponent
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
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    TabsPage,
    UpgradePopover,
    BroadcastComponent
  ],
  providers: [
    StatusBar,
    AppVersion,
    SocialSharing,
    ImageLoader,
    FileTransferObject,
    FileOpener,
    FileTransfer,
    AppGlobalService,
    CourseUtilService,
    TelemetryGeneratorService,
    QRScannerResultHandler,
    CommonUtilService,
    LogoutHandlerService,
    TncUpdateHandlerService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  exports: [
    BroadcastComponent
  ]
})
export class AppModule {

  constructor(
    private device: Device,
    private translate: TranslateService,
    private eventService: EventService,
    private events: Events,
    private imageConfig: ImageLoaderConfig) {

    translate.setDefaultLang('en');

    this.registerForEvent();
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;

    SunbirdSdk.instance.init({
      apiConfig: {
        baseUrl: 'https://dev.sunbirded.org',
        user_authentication: {
          redirectUrl: 'org.sunbird.app.dev://mobile',
          logoutUrl: '',
          authUrl: ''
        },
        api_authentication: {
          mobileAppKey: 'sunbird - 0.1',
          mobileAppSecret: 'd0299ce55a6440eb968b46f355e22504',
          mobileAppConsumer: 'mobile_device',
          channelId: 'b00bc992ef25f1a9a8d63291e20efc8d',
          producerId: 'dev.sunbird.app',
          deviceId: ''
        },
        cached_requests: {
          timeToLive: 2000
        }
      },
      dbContext: {
        getDBName: () => 'GenieServices.db',
        getDBVersion: () => 16,
        getAppMigrationList(): []
      },
      contentServiceConfig: {
        apiPath: 'SAME_URL'
      },
      courseServiceConfig: {
        apiPath: 'SAME_URL'
      },
      formServiceConfig: {
        apiPath: '',
        formFilePath: ''
      },
      frameworkServiceConfig: {
        apiPath: '',
        frameworkConfigFilePaths: [],
        channelConfigFilePath: ''
      },
      profileServiceConfig: {
        apiPath: 'SAME_URL',
        searchProfilePath: ''
      },
      pageServiceConfig: {
        apiPath: '',
        filePath: ''
      }
    });
  }

  registerForEvent() {
    this.eventService.register((response) => {
      const res = JSON.parse(response);
      if (res && res.type === 'genericEvent') {
        this.events.publish('generic.event', response);
      } else {
        this.events.publish('genie.event', response);
      }

    }, (error) => {
      // console.log("Event : " + error);
    });
  }
}
