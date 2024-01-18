import {PenerimaanAkad} from "./penerimaan-akad";

export class User {
  public id!: string;
  public name!: string;
  public username!: string;
  public password!: string;
  public role!: string;
  public workArea!: string;
  public akad!: PenerimaanAkad

}

export class Credential {
  constructor(public username: string,
              public password: string) {}
}
