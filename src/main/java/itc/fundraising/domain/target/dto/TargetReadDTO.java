package itc.fundraising.domain.target.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.UserWorkArea;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class TargetReadDTO {
    private UUID id;
    private LocalDate date;
    private UserWorkArea unit;
    private Integer inputTarget;

}
