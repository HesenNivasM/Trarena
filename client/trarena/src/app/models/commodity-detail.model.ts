import { UserData } from './user-data.model';

export class CommodityDetail {
    title: string;
    description: string;
    quantity: string;
    basePrice: number;
    date: Date;
    imageUrl: string;
    user: UserData;
}