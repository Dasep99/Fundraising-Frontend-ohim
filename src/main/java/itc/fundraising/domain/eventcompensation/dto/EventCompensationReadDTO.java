package itc.fundraising.domain.eventcompensation.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.EventContract;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class EventCompensationReadDTO {

    private UUID id;

    private LocalDate date;

    private EventContract contract;

    private Integer amount;

    private String bkkPhoto;

    private String dossierPhoto;

    private UserReadDTO user;

}
