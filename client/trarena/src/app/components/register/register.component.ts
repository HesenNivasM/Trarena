import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from '../../models/user-detail.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { Subscription } from 'rxjs';
import { UserApiResponse } from 'src/app/models/user-api-response.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    userDetail: UserDetail;
    jobTypes: string[];
    repeatPassword: string;
    error: string;
    success: string;
    private subscriptionList: Subscription[];

    constructor(
        private trarenaService: TrarenaService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.jobTypes = ['Farmer', 'Trader', 'Buyer'];
        this.userDetail = new UserDetail();
        this.userDetail.name = '';
        this.userDetail.email = '';
        this.userDetail.mobileNumber = '';
        this.userDetail.jobType = '';
        this.userDetail.password = '';
        this.repeatPassword = '';
        this.error = null;
        this.success = null;
        this.subscriptionList = [];
    }

    submitForm() {
        if (
            this.userDetail.password.length < 4 ||
            this.repeatPassword.length < 4
        ) {
            this.error = "Password's length must be greater than 4";
        } else if (this.userDetail.password !== this.repeatPassword) {
            this.error = 'Passwords do not match';
        } else {
            const subscription = this.trarenaService
                .createUser(this.userDetail)
                .subscribe((res: UserApiResponse) => {
                    if (res.success) {
                        this.error = null;
                        this.success = res.reason;
                        // this.router.navigate(['/']);
                    } else {
                        this.success = null;
                        this.error = res.reason;
                    }
                });
            this.subscriptionList.push(subscription);
        }
    }

    ngOnDestroy() {
        while (this.subscriptionList.length > 0) {
            let subscription = this.subscriptionList.pop();
            subscription.unsubscribe();
        }
    }
}
