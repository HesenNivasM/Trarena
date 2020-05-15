import { ApiResponse } from './api-response.model';
import { AuctionRoomData } from './auction-room-data.model';

export class AuctionRoomApiResponse extends ApiResponse {
    auctionRoomData: AuctionRoomData;
}
