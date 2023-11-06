import {Donor} from "./donor";
import {User} from "./user";

export class CashlessDonation {
  public id!: string;
  public date!: string;
  public contract!: string;
  public receiptNumber!: string
  public items!: string[]
  public receiptPhoto!: string
  public otherInfo!: string
  public donor!: Donor
  public userId!: string
  public donorId!: string
  public user!: User
  public amount!: number;
  public transfersAccount!: string
}
