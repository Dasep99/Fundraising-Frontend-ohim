import {User} from "./user";
import {Donor} from "./donor";

export class CashDonation {
  public id!: string;
  public date!: string;
  public contract!: string;
  public receiptNumber!: string
  public amount!: number
  public receiptPhoto!: string
  public userId!: string
  public donorId!: string
  public donor!: Donor
  public user!: User
  public transfersAccount!: string
  public items!: string[]
}

