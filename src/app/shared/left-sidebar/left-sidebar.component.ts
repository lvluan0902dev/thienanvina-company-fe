import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  public token: any;
  public userData: any;
  public name: string = '';
  public url: string = environment.apiUrl;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.name = this.userData.name;
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
