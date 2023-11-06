package itc.fundraising.domain.pickupdonation.dto;

import itc.fundraising.domain.charitybox.dto.CharityBoxReadDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.PickUpInfo;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
public class PickUpDonationReadDTO {

    private UUID id;

    private LocalDate date;

    private PickUpInfo pickUpInfo;

    private Integer amount;

    private String contract;

    private String receiptNumber;

    private String photo;

    private String replaced;

    private String otherInfo;

    private UserReadDTO user;

    private CharityBoxReadDTO charityBox;

}
