package itc.fundraising.domain.guest.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class GuestReadDTO {

    private UUID id;

    private LocalDate date;

    private String name;

    private String address;

    private String phoneNumber;

    private String purpose;

    private String photo;

    private UserReadDTO user;
}
