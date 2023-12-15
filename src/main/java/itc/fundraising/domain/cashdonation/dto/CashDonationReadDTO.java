package itc.fundraising.domain.cashdonation.dto;

import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.DonationContract;
import itc.fundraising.enums.DonationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CashDonationReadDTO {

    private UUID id;

    private LocalDate date;

    private DonationContract contract;

    private String receiptNumber;

    private Integer amount;

    private String receiptPhoto;

    private DonationStatus status;

    private UserReadDTO user;

    private DonorReadDTO donor;

}
