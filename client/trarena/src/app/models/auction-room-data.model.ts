import { UserData } from './user-data.model';
import { CommodityData } from './commodity-data.model';

export class AuctionRoomData {
    _id: string;
    roomId: string;
    status: Boolean;
    commodity: CommodityData;
    messages: Object[];
    members: UserData[];
    date: Date;
}
