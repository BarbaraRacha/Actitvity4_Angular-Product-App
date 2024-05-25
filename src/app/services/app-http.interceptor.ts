import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {finalize, Observable} from "rxjs";
import {AppStateService} from "./app-state.service";
import {LoadingService} from "./loading.service";


@Injectable()
export  class AppHttpInterceptor implements HttpInterceptor {
  constructor(private appState : AppStateService, private loadingService : LoadingService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*
    this.appState.setProductState({
      status : "LOADING"
    })
    */
    this.loadingService.showLoadingSpinner();
    let req = request.clone({
      headers : request.headers.set("Authorization", "Bearer JWT")
    });
    return next.handle(req).pipe(
      finalize(()=>{
        /*
        this.appState.setProductState({
          status : ""
        })
         */
        this.loadingService.hideLoadingSpinner();
      })
    );
  }

}
