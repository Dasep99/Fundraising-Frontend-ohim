package itc.fundraising.domain.charitybox;

import itc.fundraising.domain.charitybox.dto.CharityBoxCreateDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxReadDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.CharityBoxInfo;
import org.springframework.stereotype.Component;

@Component
public class CharityBoxMapper {

    private final UserMapper userMapper;

    public CharityBoxMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CharityBox toCharityBoxCreate(CharityBoxCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CharityBox charityBox = new CharityBox();

        if ( dto.getCharityBoxInfo() != null ) {
            charityBox.setCharityBoxInfo( Enum.valueOf( CharityBoxInfo.class, dto.getCharityBoxInfo().trim() ) );
        }
        charityBox.setOutletName( dto.getOutletName().trim() );
        charityBox.setCode( dto.getCode() );
        charityBox.setAddress( dto.getAddress().trim() );
        charityBox.setOwnerName( dto.getOwnerName().trim() );
        charityBox.setPhoneNumber( dto.getPhoneNumber().trim() );
        charityBox.setDepositDate( dto.getDepositDate() );
        charityBox.setOutletPhoto( dto.getOutletPhoto() );
        charityBox.setCoordinates( dto.getCoordinates().trim() );
        charityBox.setOtherInfo( dto.getOtherInfo() );

        return charityBox;
    }

    public CharityBox toCharityBoxUpdate(CharityBoxUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CharityBox charityBox = new CharityBox();

        charityBox.setCreatedAt( dto.getCreatedAt() );
        charityBox.setId( dto.getId() );
        if ( dto.getCharityBoxInfo().trim() != null ) {
            charityBox.setCharityBoxInfo( Enum.valueOf( CharityBoxInfo.class, dto.getCharityBoxInfo().trim() ) );
        }
        charityBox.setOutletName( dto.getOutletName().trim() );
        charityBox.setCode( dto.getCode().trim() );
        charityBox.setAddress( dto.getAddress().trim() );
        charityBox.setOwnerName( dto.getOwnerName().trim() );
        charityBox.setPhoneNumber( dto.getPhoneNumber().trim() );
        charityBox.setDepositDate( dto.getDepositDate() );
        charityBox.setOutletPhoto( dto.getOutletPhoto() );
        charityBox.setCoordinates( dto.getCoordinates().trim() );
        charityBox.setOtherInfo( dto.getOtherInfo() );

        return charityBox;
    }

    public CharityBoxReadDTO toDto(CharityBox charityBox) {
        if ( charityBox == null ) {
            return null;
        }

        CharityBoxReadDTO charityBoxReadDTO = new CharityBoxReadDTO();

        charityBoxReadDTO.setMapsUrl( toMapsUrl( charityBox.getCoordinates() ) );
        charityBoxReadDTO.setId( charityBox.getId() );
        charityBoxReadDTO.setCharityBoxInfo( charityBox.getCharityBoxInfo() );
        charityBoxReadDTO.setOutletName( charityBox.getOutletName() );
        charityBoxReadDTO.setCode( charityBox.getCode() );
        charityBoxReadDTO.setAddress( charityBox.getAddress() );
        charityBoxReadDTO.setOwnerName( charityBox.getOwnerName() );
        charityBoxReadDTO.setPhoneNumber( charityBox.getPhoneNumber() );
        charityBoxReadDTO.setDepositDate( charityBox.getDepositDate() );
        charityBoxReadDTO.setOutletPhoto( charityBox.getOutletPhoto() );
        charityBoxReadDTO.setCoordinates( charityBox.getCoordinates() );
        charityBoxReadDTO.setOtherInfo( charityBox.getOtherInfo() );
        charityBoxReadDTO.setUser( userMapper.toDto( charityBox.getUser() ) );

        return charityBoxReadDTO;
    }

    private String toMapsUrl(String coordinates) {
        String[] latitude = coordinates.split(",");
        return "https://maps.google.com/maps?q=" + latitude[0].trim() + "," + latitude[1].trim();
    }

}
