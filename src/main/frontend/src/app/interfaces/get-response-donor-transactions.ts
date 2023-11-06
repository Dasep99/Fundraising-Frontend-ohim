import {Donor} from "../common/donor";
import {DonorTransactionHistory} from "../common/donor-transaction-history";

export interface GetResponseDonorTransactions {
  data: DonorTransactionHistory[]
}
