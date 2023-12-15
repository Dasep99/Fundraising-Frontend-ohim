package itc.fundraising.domain.charitybox.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.CharityBoxInfo;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CharityBoxReadDTO {

    private UUID id;

    private CharityBoxInfo charityBoxInfo;

    private String outletName;

    private String code;

    private String address;

    private String ownerName;

    private String phoneNumber;

    private LocalDate depositDate;

    private String outletPhoto;

    private String coordinates;

    private String otherInfo;

    private String mapsUrl;

    private UserReadDTO user;

}
