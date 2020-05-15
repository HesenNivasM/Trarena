import { ApiResponse } from './api-response.model';
import { CommodityData } from './commodity-data.model';

export class CommodityApiResponse extends ApiResponse {
    commodityData: CommodityData[];
    count: number;
}
