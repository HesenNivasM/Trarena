import { Component, OnInit, Input } from '@angular/core';
import { CommodityData } from 'src/app/models/commodity-data.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { UserData } from 'src/app/models/user-data.model';
import { CommodityCardApiResponse } from 'src/app/models/commodity-card-api-response.model';

@Component({
    selector: 'app-commodity-card',
    templateUrl: './commodity-card.component.html',
    styleUrls: ['./commodity-card.component.css'],
})
export class CommodityCardComponent implements OnInit {
    @Input() commodity: CommodityData;
    @Input() parentClassName: String;
    toggleShow: boolean;
    toggleWord: string;
    dateOfCreation: Date;
    interestedButton: String;
    interestedBoolean: boolean;
    user: UserData;

    constructor(private trarenaService: TrarenaService) {}

    ngOnInit(): void {
        this.user = this.trarenaService.getUserData();
        this.toggleShow = false;
        this.interestedBoolean = false;
        this.intializeInterestedButton();
        if (this.toggleShow) {
            this.toggleWord = 'Hide';
        } else {
            this.toggleWord = 'Show More';
        }
        this.dateOfCreation = this.extractDateOfCreation(this.commodity._id);
    }

    toggleShowHide() {
        this.toggleShow = !this.toggleShow;
        if (this.toggleShow) {
            this.toggleWord = 'Hide';
        } else {
            this.toggleWord = 'Show More';
        }
    }

    intializeInterestedButton() {
        this.interestedBoolean = false;
        this.commodity.interestedUsers.forEach((user: UserData) => {
            if (user._id === this.user._id) {
                this.interestedBoolean = true;
            }
        });
        if (!this.interestedBoolean) {
            this.interestedButton = 'Interested';
        } else {
            this.interestedButton = 'Not Interested';
        }
    }

    extractDateOfCreation(id: string) {
        return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000);
    }

    // Make a request to add the user in the product's bid
    interestedInBidding() {
        this.trarenaService
            .interestedInBidding(this.commodity, this.user, !this.interestedBoolean)
            .subscribe((res: CommodityCardApiResponse) => {
                if (res.success) {
                    this.commodity.interestedUsers = res.interestedUsers;
                    this.intializeInterestedButton();
                } else {
                    console.log(res);
                }
            });
    }
}
