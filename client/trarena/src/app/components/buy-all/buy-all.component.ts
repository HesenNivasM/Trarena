import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TrarenaService } from 'src/app/services/trarena.service';
import { UserData } from 'src/app/models/user-data.model';
import { CommodityApiResponse } from 'src/app/models/commodity-api-response.model';
import { CommodityData } from 'src/app/models/commodity-data.model';

@Component({
    selector: 'app-buy-all',
    templateUrl: './buy-all.component.html',
    styleUrls: ['./buy-all.component.css'],
})
export class BuyAllComponent implements OnInit {
    error: string;
    success: string;
    length = 100;
    pageSize = 12;
    user: UserData;
    pageEvent: PageEvent;
    commodities: CommodityData[];
    extraCards: number[];
    parentClassName: String;
    // Search Option
    searchCategory: String;
    searchCategoryValues: String[];
    searchQuery: String;

    constructor(private trarenaService: TrarenaService) {}

    ngOnInit(): void {
        this.error = null;
        this.success = null;
        this.user = this.trarenaService.getUserData();
        this.subscribeToCommodityStrream();
        this.trarenaService.getCommodity(this.user, this.pageSize);
        this.parentClassName = 'buy-all';
        this.searchCategoryValues = ['Title', 'Description', 'From Farmer', 'From Trader'];
        this.searchQuery = '';
    }

    subscribeToCommodityStrream() {
        this.trarenaService.CommodityStream().subscribe((res: CommodityApiResponse) => {
            if (res && res.success) {
                this.length = res.count;
                this.commodities = res.commodityData;
                console.log(res.commodityData);
            }
        });
    }

    public paginatorData(event?: PageEvent) {
        this.trarenaService.getCommodity(this.user, (event.pageIndex + 1) * this.pageSize);
        return event;
    }

    searchThru() {
        this.trarenaService.getCommodity(this.user, this.pageSize, {
            searchCategory: this.searchCategory,
            searchQuery: this.searchQuery,
        });
    }

    removeSold(commodities: CommodityData[]): CommodityData[] {
        let comm = [];
        commodities.forEach((commodity) => {
            console.log(commodities);
            console.log(commodity);
            console.log(commodity.soldTo);
            console.log(commodity.soldTo._id);
            console.log(
                'commodity.soldTo',
                commodity.soldTo,
                'commodity.soldTo._id',
                commodity.soldTo['_id'],
                commodity.soldTo && commodity.soldTo._id
            );
            if (commodity.soldTo && commodity.soldTo._id) {
                comm = comm;
            } else {
                comm.push(commodity);
            }
        });
        return comm;
    }
}
