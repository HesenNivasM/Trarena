import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TrarenaService } from 'src/app/services/trarena.service';
import { UserData } from 'src/app/models/user-data.model';
import { CommodityApiResponse } from 'src/app/models/commodity-api-response.model';
import { CommodityData } from 'src/app/models/commodity-data.model';

@Component({
    selector: 'app-sell-all',
    templateUrl: './sell-all.component.html',
    styleUrls: ['./sell-all.component.css'],
})
export class SellAllComponent implements OnInit {
    error: string;
    success: string;
    length = 100;
    pageSize = 12;
    user: UserData;
    pageEvent: PageEvent;
    commodities: CommodityData[];
    extraCards: number[];
    parentClassName: String;

    constructor(private trarenaService: TrarenaService) {}

    ngOnInit(): void {
        this.error = null;
        this.success = null;
        this.user = this.trarenaService.getUserData();
        this.subscribeToCommodityStrream();
        this.trarenaService.getUsersCommodity(this.user, this.pageSize);
        this.parentClassName = 'sell-all';
    }

    subscribeToCommodityStrream() {
        this.trarenaService.CommodityStream().subscribe((res: CommodityApiResponse) => {
            if (res && res.success) {
                this.length = res.count;
                this.commodities = res.commodityData;
                console.log(this.commodities);
            }
        });
    }

    public paginatorData(event?: PageEvent) {
        this.trarenaService.getUsersCommodity(this.user, (event.pageIndex + 1) * this.pageSize);
        console.log(event);
        return event;
    }
}
