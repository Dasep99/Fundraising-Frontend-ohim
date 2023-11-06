package itc.fundraising.domain.cashlessdonation.dto;

import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.CashlessContract;
import itc.fundraising.enums.CashlessItem;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CashlessDonationReadDTO {

    private UUID id;

    private LocalDate date;

    private CashlessContract contract;

    private List<CashlessItem> items;

    private String receiptNumber;

    private String receiptPhoto;

    private String otherInfo;

    private UserReadDTO user;

    private DonorReadDTO donor;

}
