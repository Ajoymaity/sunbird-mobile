import { APP_INITIALIZER, ErrorHandler, NgModule, Provider } from '@angular/core';
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
import { AppGlobalService } from '@app/service';
import { CourseUtilService } from '@app/service';
import { UpgradePopover } from '@app/pages/upgrade';
import { TelemetryGeneratorService } from '@app/service';
import { QRScannerResultHandler } from '@app/pages/qrscanner';
import { CommonUtilService } from '@app/service';
import { BroadcastComponent } from '@app/component/broadcast/broadcast';
import { LogoutHandlerService } from '@app/service/handlers/logout-handler.service';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';
import { SunbirdSdk } from 'sunbird-sdk';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

export const translateHttpLoaderFactory = (httpClient: HttpClient) => {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
};

export namespace SunbirdSdkInjectionTokens {
  export const CONTENT_SERVICE = 'CONTENT_SERVICE';
  export const COURSE_SERVICE = 'COURSE_SERVICE';
}

export const sunbirdSdkServicesProvidersFactory: () => Provider[] = () => {
  return [{
    provide: SunbirdSdkInjectionTokens.CONTENT_SERVICE,
    useValue: SunbirdSdk.instance.contentService
  }, {
    provide: SunbirdSdkInjectionTokens.COURSE_SERVICE,
    useValue: SunbirdSdk.instance.courseService
  }];
};

export const sunbirdSdkFactory: (uniqueDeviceID: UniqueDeviceID) => () => Promise<void> =
  (uniqueDeviceID: UniqueDeviceID) => {
    return async () => {
      const deviceId = await uniqueDeviceID.get();

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
              deviceId: deviceId
            },
            cached_requests: {
              timeToLive: 2000
            }
          },
          dbContext: {
            getDBName: () => 'GenieServices.db',
            getDBVersion: () => 16,
            getAppMigrationList: () => []
          },
          contentServiceConfig: {
            apiPath: ''
          },
          courseServiceConfig: {
            apiPath: ''
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
            apiPath: '',
            searchProfilePath: ''
          },
          pageServiceConfig: {
            apiPath: '',
            filePath: ''
          }
        });
    };
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
        useFactory: (translateHttpLoaderFactory),
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
    UniqueDeviceID,
    ...sunbirdSdkServicesProvidersFactory(),
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: APP_INITIALIZER, useFactory: sunbirdSdkFactory, deps: [UniqueDeviceID], multi: true }
  ],
  exports: [
    BroadcastComponent
  ]
})
export class AppModule {

  constructor(
    private translate: TranslateService,
    private eventService: EventService,
    private events: Events,
    private imageConfig: ImageLoaderConfig) {

    this.setDefaultLanguage();

    this.registerForEvent();

    this.configureImageLoader();
  }

  private configureImageLoader() {
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('en');
  }

  private registerForEvent() {
    this.eventService.register((response) => {
      const res = JSON.parse(response);
      if (res && res.type === 'genericEvent') {
        this.events.publish('generic.event', response);
      } else {
        this.events.publish('genie.event', response);
      }
    }, () => {
    });
  }
}
