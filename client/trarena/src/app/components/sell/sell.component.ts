import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/user-data.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { FileUploader } from 'ng2-file-upload';
import { CommodityDetail } from 'src/app/models/commodity-detail.model';
import { CommodityApiResponse } from 'src/app/models/commodity-api-response.model';

@Component({
    selector: 'app-sell',
    templateUrl: './sell.component.html',
    styleUrls: ['./sell.component.css'],
})
export class SellComponent implements OnInit {
    title: string;
    description: string;
    quantity: string;
    basePrice: number;
    date: Date;
    user: UserData;
    error: string;
    success: string;
    imageUrl: string;
    public uploader: FileUploader = new FileUploader({
        url: 'http://localhost:9999/api/commodity/upload',
        itemAlias: 'image',
    });
    constructor(private trarenaService: TrarenaService) {}

    ngOnInit(): void {
        this.error = null;
        this.success = null;
        this.title = '';
        this.description = '';
        this.quantity = '';
        this.basePrice = 0;
        this.date = new Date();
        this.user = this.trarenaService.getUserData();
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, status: any) => {
            status = JSON.parse(status);
            if (status && status.success) {
                this.imageUrl = status.filePath;
            }
        };
    }

    createCommodity(): void {
        const data: CommodityDetail = {
            title: this.title,
            description: this.description,
            quantity: this.quantity,
            basePrice: this.basePrice,
            date: this.date,
            imageUrl: this.imageUrl,
            user: this.user,
        };
        this.trarenaService.createCommodity(data).subscribe(
            (res: CommodityApiResponse) => {
                if (res) {
                    if (res.success) {
                        this.error = null;
                        this.success = res.reason;
                        this.title = '';
                        this.description = '';
                        this.quantity = '';
                        this.basePrice = 0;
                        this.date = new Date();
                        this.imageUrl = '';
                    } else {
                        this.success = null;
                        this.error = res.reason;
                        this.title = '';
                        this.description = '';
                        this.quantity = '';
                        this.basePrice = 0;
                        this.date = new Date();
                        this.imageUrl = '';
                    }
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }
}
