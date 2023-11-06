package itc.fundraising.domain.dailyvalidation.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;


@Getter
@Setter
public class DailyValidationReadDTO {

    private UUID id;

    private LocalDate date;

    private Integer amount;

    private String validationPhoto;

    private UserReadDTO user;

}
