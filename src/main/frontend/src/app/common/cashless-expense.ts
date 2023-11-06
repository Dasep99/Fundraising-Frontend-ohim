import {User} from "./user";

export class CashlessExpense {
  public id!: string;
  public date!: string;
  public bbkNumber!: string;
  public contract!: string;
  public distribution!: string;
  public items!: string[];
  public bbkPhoto!: string;
  public otherInfo!: string
  public userId!: string
  public user!: User
}
