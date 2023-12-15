import {User} from "./user";
import {Region} from "./region";

export class Donor {
  public id!: string;
  public donorId!: string;
  public nik!: string;
  public name!: string;
  public gender!: string;
  public birthDate!: string;
  public phoneNumber!: string;
  public street!: string;
  public village?: Region;
  public district?: Region;
  public regency?: Region;
  public province?: Region;
  public email!: string;
  public job!: string;
  public type!: string;
  public otherInfo!: string;
  public ageSegmentation!: string;
  public activeness!: string;
  public user!: User
}
