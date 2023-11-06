import {Donor} from "./donor";
import {User} from "./user";

export class TransferDonation {
  public id!: string;
  public date!: string;
  public contract!: string;
  public amount!: number;
  public receiptPhoto!: string;
  public transfersAccount!: string
  public otherInfo!: string
  public donorId!: string;
  public donor!: Donor
  public userId!: string;
  public user!: User
  public items!: string[]
}
