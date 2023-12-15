package itc.fundraising.domain.donor.dto;

import itc.fundraising.domain.region.RegionReadDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.DonorType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class DonorReadDTO {

    private UUID id;

    private String donorId;

    private String nik;

    private String name;

    private String gender;

    private LocalDate birthDate;

    private String phoneNumber;

    private String street;

    private RegionReadDTO province;

    private RegionReadDTO regency;

    private RegionReadDTO district;

    private RegionReadDTO village;

    private String email;

    private String job;

    private DonorType type;

    private String otherInfo;

    private String ageSegmentation;

    private String activeness;

    private UserReadDTO user;

}
