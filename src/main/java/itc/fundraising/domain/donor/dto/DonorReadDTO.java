package itc.fundraising.domain.donor.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.DonorType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DonorReadDTO {

    private UUID id;

    private String name;

    private String phoneNumber;

    private String address;

    private String email;

    private DonorType type;

    private UserReadDTO user;

}
