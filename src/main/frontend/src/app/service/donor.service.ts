import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GetResponseDonor} from "../interfaces/get-response-donor";
import {Donor} from "../common/donor";
import {environmentDevelopment} from "../../environments/environment.development";
import {Region} from "../common/region";


@Injectable({
  providedIn: 'root'
})
export class DonorService {

  private apiUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.donor}`;
  private regionUrl = `${environmentDevelopment.api.baseUrl}/${environmentDevelopment.api.region}`;

  constructor(private httpClient: HttpClient) {
  }

  getDonors(): Observable<Donor[]> {
    return this.httpClient.get<GetResponseDonor>(this.apiUrl).pipe(map(response => response.data))
  }

  addDonor(donor: Donor): Observable<Donor> {
    return this.httpClient.post<Donor>(this.apiUrl, donor);
  }

  updateDonor(donor: Donor): Observable<Donor> {
    return this.httpClient.put<Donor>(this.apiUrl, donor);
  }

  deleteDonor(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProvinces(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.regionUrl}/provinces`);
  }

  getRegencies(provinceId: string): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.regionUrl}/regencies?provinceId=${provinceId}`);
  }

  getDistricts(regencyId: string): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.regionUrl}/districts?regencyId=${regencyId}`);
  }

  getVillages(districtId: string): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.regionUrl}/villages?districtId=${districtId}`);
  }

}
