import { Component, OnInit } from '@angular/core';
import { TrarenaService } from 'src/app/services/trarena.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserApiResponse } from 'src/app/models/user-api-response.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    loggedIn: boolean;
    private subscriptionList: Subscription[];

    constructor(
        private trarenaService: TrarenaService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loggedIn = false;
        this.subscriptionList = [];
        this.subscribeToLoggedIn();
    }

    subscribeToLoggedIn(): void {
        const subscription = this.trarenaService.LoggedInStream().subscribe(
            (val: UserApiResponse) => {
                if (val) {
                    this.loggedIn = val.success;
                }
            },
            (err) => {
                console.error(err);
            }
        );
        this.subscriptionList.push(subscription);
    }

    logoutUser(): void {
        this.trarenaService.logoutUser();
        this.router.navigate(['/login']);
    }

    ngOnDestroy(): void {
        this.trarenaService.logoutUser();
        while (this.subscriptionList.length > 0) {
            let subscription = this.subscriptionList.pop();
            subscription.unsubscribe();
        }
    }
}
