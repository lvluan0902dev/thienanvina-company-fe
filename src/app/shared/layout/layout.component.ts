import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private router:Router, private adminService: AdminService) { 
    this.adminService.getUserInformation().subscribe({
      error: e => {
        if (e instanceof HttpErrorResponse) {
          if (e.status == 401) {
            localStorage.removeItem('token');
            const url = this.router.createUrlTree(['/login'], {
              queryParams: {
                return_url: this.router.url
              }
            })
            this.router.navigateByUrl(url);
          }
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
