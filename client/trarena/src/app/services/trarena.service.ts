import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetail } from '../models/user-detail.model';
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserData } from '../models/user-data.model';
import { CommodityDetail } from '../models/commodity-detail.model';
import { UserApiResponse } from '../models/user-api-response.model';
import { CommodityApiResponse } from '../models/commodity-api-response.model';
import { CommodityData } from '../models/commodity-data.model';
import { ApiResponse } from '../models/api-response.model';
import { CommodityCardApiResponse } from '../models/commodity-card-api-response.model';
import io from 'socket.io-client';
import { AuctionRoomData } from '../models/auction-room-data.model';

@Injectable({
    providedIn: 'root',
})
export class TrarenaService {
    baseUrl: string;
    private loggedIn: boolean;
    private userData: UserData;
    private socket;
    private auctionRoomData: AuctionRoomData;
    private subscriptionList: Subscription[];

    private _loggedInStream: BehaviorSubject<UserApiResponse> = new BehaviorSubject(null);

    private _commodityStream: BehaviorSubject<CommodityApiResponse> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:9999/';
        this.socket = io.connect('localhost:9999/', {
            transports: ['websocket', 'xhr-polling'],
        });
        this.subscriptionList = [];
        //////////////////////////////////////////////
        this.userData = {
            _id: '5e8d86d827ef81185453c60c',
            name: 'user',
            email: 'user@gmail.com',
            mobileNumber: '987654321',
            jobType: 'Farmer',
        };
        this.auctionRoomData = {
            _id: '5eb67156d2b6e80a20cf7a73',
            commodity: {
                user: {
                    _id: '5e8d86d827ef81185453c60c',
                    name: 'user',
                    email: 'user@gmail.com',
                    mobileNumber: '987654321',
                    jobType: 'Farmer',
                },
                _id: '5e95cc91bde8041358b99bde',
                title: 'New addition',
                description: 'Domething',
                quantity: '55',
                date: new Date('2020-05-07T06:18:00.000Z'),
                basePrice: 55,
                imageUrl: 'public\\uploads\\image-1586875534727Copy of 1.. (1852).jpg',
                interestedUsers: [],
            },
            roomId: '5eb584e0b4690d16e89631d2',
            status: true,
            messages: [],
            members: [
                {
                    _id: '5e8d86d827ef81185453c60c',
                    name: 'user',
                    email: 'user@gmail.com',
                    mobileNumber: '987654321',
                    jobType: 'Farmer',
                },
            ],
            date: new Date('Sat May 09 2020 14:31:10 GMT+0530 (India Standard Time)'),
        };
        console.log(this.auctionRoomData);
        this._loggedInStream.next({
            success: true,
            reason: 'temp',
        });
    }

    createUser(userDetail: UserDetail): Observable<UserApiResponse> {
        let api: string = 'api/users/create-user';
        return this.http.post(`${this.baseUrl}${api}`, userDetail).pipe(
            map((res: UserApiResponse) => {
                return res;
            })
        );
    }

    LoggedInStream(): Observable<UserApiResponse> {
        return this._loggedInStream.asObservable();
    }

    loginUser(email: string, password: string): void {
        let api: string = 'api/users/login-user';
        const subscription = this.http
            .post(`${this.baseUrl}${api}`, { email: email, password: password })
            .subscribe(
                (res: UserApiResponse) => {
                    this.loggedIn = res.success;
                    console.log(res, res.userData);
                    this.userData = res.userData;
                    this._loggedInStream.next(res);
                },
                (err) => {
                    this._loggedInStream.next({
                        success: false,
                        reason: 'Server Error',
                    });
                }
            );
        this.subscriptionList.push(subscription);
    }

    logoutUser(): void {
        let api: string = 'api/users/logout-user';
        const subscription = this.http.post(`${this.baseUrl}${api}`, this.userData).subscribe(
            (res: UserApiResponse) => {
                if (res && res.success == true) {
                    this.loggedIn = false;
                    res.success = false; // To represent the loggedIn is false
                }
                this._loggedInStream.next(res);
            },
            (err) => {
                this._loggedInStream.next({
                    success: false,
                    reason: 'Server Error',
                });
            }
        );
        this.subscriptionList.push(subscription);
    }

    getUserData(): UserData {
        return this.userData;
    }

    createCommodity(commodityDetail: CommodityDetail): Observable<CommodityApiResponse> {
        let api: string = 'api/commodity/create';
        return this.http.post(`${this.baseUrl}${api}`, commodityDetail).pipe(
            map((res: CommodityApiResponse) => {
                return res;
            })
        );
    }

    // Get all commodities of the user
    getUsersCommodity(userData: UserData, count: number): void {
        let api: string = 'api/commodity/user/' + count;
        let subscription = this.http.post(`${this.baseUrl}${api}`, userData).subscribe(
            (res: CommodityApiResponse) => {
                // let commodities = res.commodityData;
                // let finalData = [];
                // let singleData = [];
                // commodities.forEach((element, index) => {
                //     singleData.push(element);
                //     if (index !== 0 && (index + 1) % 3 === 0) {
                //         finalData.push(singleData);
                //         singleData = [];
                //     }
                //     if (
                //         commodities.length - 1 === index &&
                //         (index + 1) % 3 !== 0
                //     ) {
                //         finalData.push(singleData);
                //     }
                // });
                // res.commodityData = finalData;

                let commodities = res.commodityData;
                let finalData = [];
                let singleData = [];
                commodities.forEach((element, index) => {
                    // Make the image url to image match image point
                    element.imageUrl = this.baseUrl + element.imageUrl.split('\\')[2];

                    // Modify the time to locale string
                    element.date = new Date(element.date);

                    // Split into arrays of 3
                    singleData.push(element);
                    if (index !== 0 && (index + 1) % 3 === 0) {
                        finalData.push(singleData);
                        singleData = [];
                    }
                    if (commodities.length - 1 === index && (index + 1) % 3 !== 0) {
                        finalData.push(singleData);
                    }
                });
                res.commodityData = finalData;

                this._commodityStream.next(res);
            },
            (err) => {
                this._loggedInStream.next({
                    success: false,
                    reason: 'Server Error',
                });
            }
        );
        this.subscriptionList.push(subscription);
    }

    // Get commodities except the specific user
    getCommodity(userData: UserData, count: number, searchFactors?: Object): void {
        let api: string;
        let payload: Object;
        if (searchFactors) {
            api = 'api/commodity/search/' + count;
            payload = { userData: userData, searchFactors: searchFactors };
        } else {
            api = 'api/commodity/' + count;
            payload = userData;
        }
        let subscription = this.http.post(`${this.baseUrl}${api}`, payload).subscribe(
            (res: CommodityApiResponse) => {
                // let commodities = res.commodityData;
                // let finalData = [];
                // let singleData = [];
                // commodities.forEach((element, index) => {
                //     singleData.push(element);
                //     if (index !== 0 && (index + 1) % 3 === 0) {
                //         finalData.push(singleData);
                //         singleData = [];
                //     }
                //     if (
                //         commodities.length - 1 === index &&
                //         (index + 1) % 3 !== 0
                //     ) {
                //         finalData.push(singleData);
                //     }
                // });
                // res.commodityData = finalData;

                let commodities = res.commodityData;
                let commoditiesWithoutSold = [];
                let chumma = 0;

                commodities.forEach((commodity) => {
                    if (commodity.soldTo && commodity.soldTo._id) {
                        chumma = 1;
                    } else {
                        commoditiesWithoutSold.push(commodity);
                    }
                });

                commodities = commoditiesWithoutSold;
                let finalData = [];
                let singleData = [];
                commodities.forEach((element, index) => {
                    // Make the image url to image match image point
                    element.imageUrl = this.baseUrl + element.imageUrl.split('\\')[2];

                    // Modify the time to locale string
                    element.date = new Date(element.date);

                    // Split into arrays of 3
                    singleData.push(element);
                    if (index !== 0 && (index + 1) % 3 === 0) {
                        finalData.push(singleData);
                        singleData = [];
                    }
                    if (commodities.length - 1 === index && (index + 1) % 3 !== 0) {
                        finalData.push(singleData);
                    }
                });
                res.commodityData = finalData;
                res.count = commoditiesWithoutSold.length;
                console.log(res);
                this._commodityStream.next(res);
            },
            (err) => {
                this._loggedInStream.next({
                    success: false,
                    reason: 'Server Error',
                });
            }
        );
        this.subscriptionList.push(subscription);
    }

    interestedInBidding(
        commodityData: CommodityData,
        userData: UserData,
        interested: boolean
    ): Observable<ApiResponse> {
        let api: string = 'api/commodity/user/interested';
        return this.http
            .post(`${this.baseUrl}${api}`, {
                commodityData: commodityData,
                userData: userData,
                interested: interested,
            })
            .pipe(
                map((res: CommodityCardApiResponse) => {
                    return res;
                })
            );
    }

    getInterestedTableData(userData: UserData) {
        let api: string = 'api/cart/user/interested';
        return this.http.post(`${this.baseUrl}${api}`, { userData: userData }).pipe(
            map((res: CommodityApiResponse) => {
                return res;
            })
        );
    }

    getUsersTableData(userData: UserData) {
        let api: string = 'api/cart/user/own';
        return this.http.post(`${this.baseUrl}${api}`, { userData: userData }).pipe(
            map((res: CommodityApiResponse) => {
                return res;
            })
        );
    }

    CommodityStream(): Observable<CommodityApiResponse> {
        return this._commodityStream.asObservable();
    }

    startAuction(commodity: CommodityData, user: UserData) {
        let api: string = 'api/auction/start';
        return this.http.post(`${this.baseUrl}${api}`, { user: user, commodity: commodity }).pipe(
            map((res: ApiResponse) => {
                // Do something to the details of the auction to the auction page
                return res;
            })
        );
    }

    enterAuction(commodity: CommodityData, user: UserData) {
        let api: string = 'api/auction/join';
        return this.http.post(`${this.baseUrl}${api}`, { user: user, commodity: commodity }).pipe(
            map((res: ApiResponse) => {
                return res;
            })
        );
    }

    setAuctionRoomData(auctionRoom: AuctionRoomData): void {
        this.auctionRoomData = auctionRoom;
    }

    getAuctionRoomData(): AuctionRoomData {
        return this.auctionRoomData;
    }

    isAuctionRoomData(): boolean {
        if (this.auctionRoomData) {
            return true;
        }
        return false;
    }

    isUserData(): boolean {
        if (this.userData) {
            return true;
        }
        return false;
    }

    joinAuctionRoom(data: Object): void {
        this.socket.emit('joinAuctionRoom', data);
    }

    // {user: user, commodity: commodity, message: message}
    sendMessage(data: Object): void {
        this.socket.emit('message', data);
    }

    auctionRoomUpdate() {
        return new Observable<{ auctionRoom: AuctionRoomData }>((observer) => {
            this.socket.on('auctionRoomUpdate', (data: { auctionRoom: AuctionRoomData }) => {
                observer.next({ auctionRoom: data.auctionRoom });
            });
            return () => {
                this.socket.disconnect();
            };
        });
    }

    exitAuction(data: { auctionRoom: AuctionRoomData; user: UserData }) {
        console.log('exitAuction');
        this.socket.emit('exitAuction', data);
    }

    sellCommodity(data: { auctionRoom: AuctionRoomData; sellToUser: UserData }) {
        let api: string = 'api/auction/sell';
        console.log('called', data);
        return this.http.post(`${this.baseUrl}${api}`, data).pipe(
            map((res: ApiResponse) => {
                return res;
            })
        );
    }

    getSoldCommodities(data: { user: UserData }) {
        let api: string = 'api/auction/sold';
        console.log('called', data);
        return this.http.post(`${this.baseUrl}${api}`, data).pipe(
            map((res: ApiResponse) => {
                return res;
            })
        );
    }

    getBoughtCommodities(data: { user: UserData }) {
        let api: string = 'api/auction/bought';
        console.log('called', data);
        return this.http.post(`${this.baseUrl}${api}`, data).pipe(
            map((res: ApiResponse) => {
                return res;
            })
        );
    }

    ngOnDestroy() {
        while (this.subscriptionList.length > 0) {
            let subscription = this.subscriptionList.pop();
            subscription.unsubscribe();
        }
    }
}
