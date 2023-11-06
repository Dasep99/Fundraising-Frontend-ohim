package itc.fundraising.domain.guest;

import itc.fundraising.domain.guest.dto.GuestCreateDTO;
import itc.fundraising.domain.guest.dto.GuestReadDTO;
import itc.fundraising.domain.guest.dto.GuestUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class GuestMapper {

    private final UserMapper userMapper;

    public GuestMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Guest toGuestCreate(GuestCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Guest guest = new Guest();

        guest.setDate( dto.getDate() );
        guest.setName( dto.getName().trim() );
        guest.setAddress( dto.getAddress().trim() );
        guest.setPhoneNumber( dto.getPhoneNumber().trim() );
        guest.setPurpose( dto.getPurpose().trim() );
        guest.setPhoto( dto.getPhoto() );

        return guest;
    }

    public Guest toGuestUpdate(GuestUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Guest guest = new Guest();

        guest.setCreatedAt( dto.getCreatedAt() );
        guest.setId( dto.getId() );
        guest.setDate( dto.getDate() );
        guest.setName( dto.getName().trim() );
        guest.setAddress( dto.getAddress().trim() );
        guest.setPhoneNumber( dto.getPhoneNumber().trim() );
        guest.setPurpose( dto.getPurpose().trim() );
        guest.setPhoto( dto.getPhoto() );

        return guest;
    }

    public GuestReadDTO toDto(Guest guest) {
        if ( guest == null ) {
            return null;
        }

        GuestReadDTO guestReadDTO = new GuestReadDTO();

        guestReadDTO.setId( guest.getId() );
        guestReadDTO.setDate( guest.getDate() );
        guestReadDTO.setName( guest.getName() );
        guestReadDTO.setAddress( guest.getAddress() );
        guestReadDTO.setPhoneNumber( guest.getPhoneNumber() );
        guestReadDTO.setPurpose( guest.getPurpose() );
        guestReadDTO.setPhoto( guest.getPhoto() );
        guestReadDTO.setUser( userMapper.toDto( guest.getUser() ) );

        return guestReadDTO;
    }

}
