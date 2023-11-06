import {User} from "./user";

export class Donor {
  public id!: string;
  public name!: string;
  public email!: string;
  public type!: string
  public phoneNumber!: string;
  public address!: string;
  public userId!: string;
  public user!: User
}
