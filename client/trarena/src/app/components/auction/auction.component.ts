import { Component, OnInit } from '@angular/core';
import { AuctionRoomData } from 'src/app/models/auction-room-data.model';
import { TrarenaService } from 'src/app/services/trarena.service';
import { UserData } from 'src/app/models/user-data.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auction',
    templateUrl: './auction.component.html',
    styleUrls: ['./auction.component.css'],
})
export class AuctionComponent implements OnInit {
    public auctionRoom: AuctionRoomData;
    public user: UserData;
    public message: String;
    public sellToUser: String;

    constructor(private trarenaService: TrarenaService, private router: Router) {}

    ngOnInit(): void {
        // If the auciton room status is false redirect to cart
        if (this.trarenaService.isAuctionRoomData() && this.trarenaService.isUserData()) {
            // The data are present and make the user join the chat
            this.loadAuctionDetails();
            if (this.auctionRoom.status) {
                this.joinAuctionRoom({ user: this.user, auctionRoom: this.auctionRoom });
            } else {
                this.router.navigate(['/cart']);
            }
        } else {
            this.router.navigate(['/cart']);
        }
        console.log(this.auctionRoom, this.user);
        this.auctionRoomUpdate();
    }

    loadAuctionDetails(): void {
        this.auctionRoom = this.trarenaService.getAuctionRoomData();
        this.user = this.trarenaService.getUserData();
    }

    joinAuctionRoom(data: Object): void {
        this.trarenaService.joinAuctionRoom(data);
    }

    auctionRoomUpdate() {
        this.trarenaService
            .auctionRoomUpdate()
            .subscribe((data: { auctionRoom: AuctionRoomData }) => {
                if (this.auctionRoom && this.auctionRoom.roomId === data.auctionRoom.roomId) {
                    this.auctionRoom = data.auctionRoom;
                    console.log(this.auctionRoom.messages);
                }
            });
    }

    exitAuction() {
        this.trarenaService.exitAuction({ auctionRoom: this.auctionRoom, user: this.user });
        this.router.navigate(['/cart']);
    }

    sendMessage() {
        console.log(this.message);
        this.trarenaService.sendMessage({
            user: this.user,
            auctionRoom: this.auctionRoom,
            message: this.message,
        });
        this.message = '';
    }

    sellCommodity() {
        this.trarenaService
            .sellCommodity({
                auctionRoom: this.auctionRoom,
                sellToUser: this.returnUserFromId(this.sellToUser),
            })
            .subscribe((res) => {
                if (res) {
                    this.router.navigate(['/cart']);
                } else {
                    console.log('error');
                }
            });
    }

    returnUserFromId(id: String): UserData {
        let returnData: UserData;
        this.auctionRoom.members.forEach((member) => {
            if (member._id === id) {
                console.log(member._id, id);
                returnData = member;
            }
        });
        return returnData;
    }
}
