package itc.fundraising.domain.boxdonation.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class BoxDonationReadDTO {

    private UUID id;

    private LocalDate date;

    private String receiptNumber;

    private Integer amount;

    private String receiptPhoto;

    private UserReadDTO user;

}
