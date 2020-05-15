import { ApiResponse } from './api-response.model';
import { UserData } from './user-data.model';

export class CommodityCardApiResponse extends ApiResponse {
    interestedUsers?: UserData[];
}
