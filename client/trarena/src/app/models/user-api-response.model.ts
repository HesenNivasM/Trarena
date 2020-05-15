import { ApiResponse } from './api-response.model';
import { UserData } from './user-data.model';

export class UserApiResponse extends ApiResponse {
    userData?: UserData;
}
