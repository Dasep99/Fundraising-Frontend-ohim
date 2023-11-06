package itc.fundraising.domain.user.dto;

import itc.fundraising.enums.UserRole;
import itc.fundraising.enums.UserWorkArea;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UserReadDTO {

    private UUID id;

    private String name;

    private String username;

    private UserRole role;

    private UserWorkArea workArea;

}
