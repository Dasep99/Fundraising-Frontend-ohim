import {User} from "./user";
import {Donor} from "./donor";

export class Visit {
  public id!: string;
  public date!: string;
  public purpose!: string;
  public otherPurpose!: string;
  public photo!: string;
  public donorId!: string;
  public userId!: string;
  public donor!: Donor;
  public user!: User;
}







