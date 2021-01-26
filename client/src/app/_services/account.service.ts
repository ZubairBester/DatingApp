import { HttpClient } from '@angular/common/http';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';                    
import { User } from '../_models/User';

@Injectable({ 
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:5001/api/';

  private currentUserSource = new ReplaySubject<User>(1);

  currentUser$ = this.currentUserSource.asObservable(); 

  constructor(private http: HttpClient) { }

  login(model: any)
  {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const User = response;
        if(User)
        {
          localStorage.setItem('user', JSON.stringify(User));
          this.currentUserSource.next(User);
        }
      })     
    );
  }

  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        
        if(user){
          localStorage.setItem('user' , JSON.stringify(user));
          this.currentUserSource.next(user);
        }
    
      })
    )
  }

  setCurrentUser (User : User){
    this.currentUserSource.next(User); 
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
