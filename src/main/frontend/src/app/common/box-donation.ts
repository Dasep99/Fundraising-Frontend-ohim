import {User} from "./user";

export class BoxDonation {
  public id!: string
  public date!: string
  public receiptNumber!: string
  public amount!: number
  public receiptPhoto!: string
  public userId!: string
  public user!: User
}
