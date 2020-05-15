import { Component, OnInit } from '@angular/core';
import { CommodityData } from 'src/app/models/commodity-data.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { UserData } from 'src/app/models/user-data.model';
import { ApiResponse } from 'src/app/models/api-response.model';

@Component({
    selector: 'app-bid',
    templateUrl: './bid.component.html',
    styleUrls: ['./bid.component.css'],
})
export class BidComponent implements OnInit {
    public soldCommodities: CommodityData[];
    public boughtCommodities: CommodityData[];
    public user: UserData;
    public toggleClassHeadings: Boolean;

    constructor(private trarenaService: TrarenaService) {}

    ngOnInit(): void {
        this.toggleClassHeadings = false;
        this.user = this.trarenaService.getUserData();
        this.loadData();
    }

    loadData(): void {
        this.trarenaService
            .getSoldCommodities({ user: this.user })
            .subscribe((res: ApiResponse) => {
                if (res.success) {
                    this.soldCommodities = res.commodityData;
                    console.log(this.soldCommodities);
                } else {
                    console.log('Error');
                }
            });

        this.trarenaService
            .getBoughtCommodities({ user: this.user })
            .subscribe((res: ApiResponse) => {
                if (res.success) {
                    this.boughtCommodities = res.commodityData;
                    console.log(this.boughtCommodities);
                } else {
                    console.log('Error');
                }
            });
    }

    toggleClassHeadingsFunction() {
        this.toggleClassHeadings = !this.toggleClassHeadings;
    }
}
