import { CommodityData } from './commodity-data.model';

export class ApiResponse {
    success: boolean;
    reason: string;
    commodityData?: CommodityData[];
}
