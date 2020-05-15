import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/user-data.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { CommodityApiResponse } from 'src/app/models/commodity-api-response.model';
import { CommodityData } from 'src/app/models/commodity-data.model';
import { AuctionRoomApiResponse } from 'src/app/models/auction-room-api-response.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
    user: UserData;
    interestedCommodities;
    interestedCommoditiesCount: Number;
    userCommodities;
    userCommoditiesCount: Number;
    toggleClassHeadings: boolean;

    constructor(private trarenaService: TrarenaService, private router: Router) {}

    ngOnInit(): void {
        this.user = this.trarenaService.getUserData();
        // Set interested commodities as the defalt table view
        this.toggleClassHeadings = false;
        this.getInterestedTableData();
        this.getUsersTableData();
    }

    getUsersTableData() {
        this.trarenaService.getUsersTableData(this.user).subscribe((res: CommodityApiResponse) => {
            if (res.success) {
                this.userCommodities = this.categorizeCommodities(res.commodityData);
                this.userCommoditiesCount = res.count;
            } else {
                console.error(res);
            }
        });
    }

    getInterestedTableData() {
        this.trarenaService
            .getInterestedTableData(this.user)
            .subscribe((res: CommodityApiResponse) => {
                if (res.success) {
                    this.interestedCommodities = this.categorizeCommodities(res.commodityData);
                    this.interestedCommoditiesCount = res.count;
                } else {
                    console.error(res);
                }
            });
    }

    extractDateOfCreation(id: string) {
        return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000);
    }

    categorizeCommodities(commodityData: CommodityData[]) {
        let commodities = {
            past: [],
            present: [],
            future: [],
        };

        commodityData.forEach((data) => {
            data.date = new Date(data.date);
            const DateComparision: Number = this.compareDates(data.date, new Date());
            if (DateComparision === -1) {
                commodities.past.push(data);
            } else if (DateComparision === 0) {
                commodities.present.push(data);
            } else {
                commodities.future.push(data);
            }
        });
        console.log(commodities);

        return commodities;
    }

    compareDates(auctionDay: Date, today: Date): Number {
        today.setMilliseconds(0); // Setting secs and milli-secs to 0 to maction the auctionDate
        console.log('Comparing', auctionDay, today, auctionDay.getTime() - today.getTime());
        if (today.getTime() > auctionDay.getTime()) {
            if (today.getTime() - auctionDay.getTime() <= 1800000) {
                // Today
                return 0;
            }
            // Past
            return -1;
        }
        // Future
        return 1;
    }

    refreshInterestedTable() {
        this.getInterestedTableData();
    }

    refreshOwnTable() {
        this.getUsersTableData();
    }

    toggleClassHeadingsFunction() {
        this.toggleClassHeadings = !this.toggleClassHeadings;
    }

    startAuction(commodity: CommodityData) {
        this.trarenaService.startAuction(commodity, this.user).subscribe(
            (res: AuctionRoomApiResponse) => {
                if (res.success) {
                    this.trarenaService.setAuctionRoomData(res.auctionRoomData);
                    this.router.navigate(['/auction']);
                } else {
                    if (res.reason === 'exists') {
                        // call enter auction
                        console.log('Room already exists... Entering the room');
                        this.enterAuction(commodity);
                    }
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    enterAuction(commodity: CommodityData) {
        this.trarenaService.enterAuction(commodity, this.user).subscribe(
            (res: AuctionRoomApiResponse) => {
                if (res.success) {
                    this.trarenaService.setAuctionRoomData(res.auctionRoomData);
                    this.router.navigate(['/auction']);
                } else {
                    console.error('Error');
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
