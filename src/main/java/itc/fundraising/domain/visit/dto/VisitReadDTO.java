package itc.fundraising.domain.visit.dto;

import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class VisitReadDTO {

    private UUID id;

    private LocalDate date;

    private String purpose;

    private String photo;

    private UserReadDTO user;

    private DonorReadDTO donor;
}
