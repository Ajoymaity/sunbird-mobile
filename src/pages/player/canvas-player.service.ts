import { Injectable } from "@angular/core";
import { SunbirdSdk } from 'sunbird-sdk';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as X2JS from 'x2js';


declare global {
    interface Window {
        handleAction: (methodName, params) => void;
    }
}
@Injectable()

export class CanvasPlayerService {
    constructor(private _http: HttpClient) { }
    handleAction() {
        window.handleAction = (methodName: string, params = []) => {
            switch (methodName) {
                case "getCurrentUser":
                    return SunbirdSdk.instance.profileService.getActiveProfileSession().toPromise();
                case "getAllUserProfile":
                    return SunbirdSdk.instance.profileService.getAllProfiles(params[0]).toPromise();
                case "setUser":
                    return SunbirdSdk.instance.profileService.setActiveSessionForProfile(params[0]).toPromise();
                case "getContent":
                    return SunbirdSdk.instance.contentService.getContents(params[0]).toPromise();
                case "getRelatedContent":
                    console.log("getRelatedContent to be defined");
                    break;
                case "getContentList":
                    return SunbirdSdk.instance.contentService.getContents(params[0]).toPromise();
                case "sendFeedback":
                    return SunbirdSdk.instance.contentFeedbackService.sendFeedback(params[0]).toPromise();
                case "languageSearch":
                    console.log('languageSearch to be defined');
                    break;
                case "endGenieCanvas":
                    console.log('endGenieCanvas to be defined');
                    break;
                case "endContent":
                    console.log('endContent to be defined');
                    break;
                case "launchContent":
                    console.log('launchContent to be defined');
                    break;
                case "send":
                    return SunbirdSdk.instance.telemetryService.saveTelemetry('');
                default:
                    console.log("Please use valid method");
            }
        }
    }

    xmlToJSon(path: string) {
        console.log("Path", path);
        if (path.length) {
            const _headers = new HttpHeaders();
            const headers = _headers.set('Content-Type', 'text/xml');
            return new Promise((resolve, reject) => {
                try {
                    this._http.get(path, { headers: _headers, responseType: 'text' }).subscribe((data) => {
                        var x2js = new X2JS();
                        console.log("JSON", x2js.xml2js(data));
                        const json = x2js.xml2js(data);
                        resolve(json);
                    });
                } catch (error) {
                    console.log("In error", error);
                    reject('Unable to convert');
                }
            });
        }
    }

    readJSON(path) {
        console.log("Path", path);
        if (path.length) {
            const _headers = new HttpHeaders();
            const headers = _headers.set('Content-Type', 'text/javascript');
            return new Promise((resolve, reject) => {
                try {
                    this._http.get(path, { headers: _headers, responseType: 'json' }).subscribe((data) => {
                        resolve(data);
                    });
                } catch (error) {
                    console.log("In error", error);
                    reject('Unable to convert');
                }
            });
        }
    }
}