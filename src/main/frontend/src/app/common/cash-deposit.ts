import {User} from "./user";

export class CashDeposit {
  public id!: string;
  public date!: string;
  public contract!: string;
  public amount!: number;
  public receiptPhoto!: string;
  public userId!: string
  public user!: User
}
