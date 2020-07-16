import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { ok } from 'assert';

export class LoginServiceMock {

postLigin(login):Observable<any>{
    
  return of({'success':'OK','user':{'username':'admin@aloivepbx.com','uid':'12','role':'publisher','name':"neelesh"},'login_token':'sdfs'})
  }
}