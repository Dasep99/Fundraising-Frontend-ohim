package itc.fundraising.domain.penerimaanperakad.dto;

import itc.fundraising.enums.DepositContract;
import itc.fundraising.enums.DonationContract;
import itc.fundraising.enums.UserWorkArea;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
public class AkadReadDTO {
    private UUID id;
    private UserWorkArea unit;
    private DepositContract donationcontract;
}
