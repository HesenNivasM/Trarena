import { UserData } from './user-data.model';

export class CommodityData {
    _id: string;
    title: string;
    description: string;
    quantity: string;
    basePrice: number;
    date: Date;
    imageUrl: string;
    user: UserData;
    interestedUsers: UserData[];
    soldTo?: UserData;
}
