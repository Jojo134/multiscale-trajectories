import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data-service.service';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class DataResolver implements Resolve<any> {
    constructor(private backend: DataService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        this.backend.loadData(this.backend.filenameall, this.backend.resolutionName);
        this.backend.dataLoaded = true;
    }
}
