import {CharityBox} from "./charity-box";
import {User} from "./user";

export class PickupDonation {
  public id!: string
  public date!: string
  public pickUpInfo!: string
  public charityBoxId!: string
  public amount!: number
  public contract!: string
  public otherContract!: string
  public receiptNumber!: string
  public photo!: string
  public replaced!: string
  public otherInfo!: string
  public user!: User
  public charityBox!: CharityBox
}
