import {User} from "./user";
import {Donor} from "./donor";
import {Target} from "./target";

export class CashDonation {
  public id!: string;
  public date!: string;
  public contract!: string;
  public receiptNumber!: string;
  public amount!: number;
  public receiptPhoto!: string;
  public status!: string;
  public donorId!: string;
  public userId!: string;
  public donor!: Donor;
  public user!: User;
  public target!: Target
}

