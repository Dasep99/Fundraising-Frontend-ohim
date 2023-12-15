import {User} from "./user";

export class EventCompensation {
  public id!: string
  public date!: string
  public contract!: string
  public amount!: number
  public bkkPhoto!: string
  public dossierPhoto!: string
  public userId!: string
  public user!: User
}
