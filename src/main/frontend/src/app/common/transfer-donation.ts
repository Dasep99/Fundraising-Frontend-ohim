import {Donor} from "./donor";
import {User} from "./user";

export class TransferDonation {
  public id!: string;
  public date!: string;
  public contract!: string;
  public amount!: number;
  public receiptPhoto!: string;
  public transfersAccount!: string;
  public status!: string;
  public donorId!: string;
  public userId!: string;
  public donor!: Donor;
  public user!: User;
}
