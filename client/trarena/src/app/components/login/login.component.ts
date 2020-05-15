import { Component, OnInit } from '@angular/core';
import { TrarenaService } from 'src/app/services/trarena.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserApiResponse } from 'src/app/models/user-api-response.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    error: string;
    success: string;
    loggedIn: boolean;
    private subscriptionList: Subscription[];

    constructor(
        private trarenaService: TrarenaService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.email = '';
        this.password = '';
        this.error = null;
        this.success = null;
        this.loggedIn = false;
        this.subscriptionList = [];
        this.subscribeToLoggedInStream();
    }

    loginUser() {
        if (this.loggedIn) {
            this.trarenaService.logoutUser();
        }
        this.trarenaService.loginUser(this.email, this.password);
        this.router.navigate(['/']);
    }

    subscribeToLoggedInStream(): void {
        const subscription = this.trarenaService
            .LoggedInStream()
            .subscribe((res: UserApiResponse) => {
                if (res) {
                    this.loggedIn = res.success;
                    if (res.success) {
                        this.error = null;
                        this.success = res.reason;
                    } else if (!res.success) {
                        this.success = null;
                        this.error = res.reason;
                    }
                }
            });
        this.subscriptionList.push(subscription);
    }

    ngOnDestroy() {
        while (this.subscriptionList.length > 0) {
            let subscription = this.subscriptionList.pop();
            subscription.unsubscribe();
        }
    }
}
