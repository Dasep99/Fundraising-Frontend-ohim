package itc.fundraising.domain.pickupdonation;

import itc.fundraising.domain.charitybox.CharityBoxMapper;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationCreateDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationReadDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.PickUpInfo;
import org.springframework.stereotype.Component;

@Component
public class PickUpDonationMapper {

    private final UserMapper userMapper;
    private final CharityBoxMapper charityBoxMapper;

    public PickUpDonationMapper(UserMapper userMapper, CharityBoxMapper charityBoxMapper) {
        this.userMapper = userMapper;
        this.charityBoxMapper = charityBoxMapper;
    }

    public PickUpDonation toPickUpDonationCreate(PickUpDonationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        PickUpDonation pickUpDonation = new PickUpDonation();

        pickUpDonation.setDate( dto.getDate() );
        if ( dto.getPickUpInfo() != null ) {
            pickUpDonation.setPickUpInfo( Enum.valueOf( PickUpInfo.class, dto.getPickUpInfo().trim() ) );
        }
        pickUpDonation.setAmount( dto.getAmount() );
        pickUpDonation.setContract( dto.getContract() );
        pickUpDonation.setReceiptNumber( dto.getReceiptNumber() );
        pickUpDonation.setPhoto( dto.getPhoto() );
        pickUpDonation.setReplaced( dto.getReplaced() );
        pickUpDonation.setOtherInfo( dto.getOtherInfo() );

        return pickUpDonation;
    }

    public PickUpDonation toPickUpDonationUpdate(PickUpDonationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        PickUpDonation pickUpDonation = new PickUpDonation();

        pickUpDonation.setCreatedAt( dto.getCreatedAt() );
        pickUpDonation.setId( dto.getId() );
        pickUpDonation.setDate( dto.getDate() );
        if ( dto.getPickUpInfo() != null ) {
            pickUpDonation.setPickUpInfo( Enum.valueOf( PickUpInfo.class, dto.getPickUpInfo().trim() ) );
        }
        pickUpDonation.setAmount( dto.getAmount() );
        pickUpDonation.setContract( dto.getContract() );
        pickUpDonation.setReceiptNumber( dto.getReceiptNumber() );
        pickUpDonation.setPhoto( dto.getPhoto() );
        pickUpDonation.setReplaced( dto.getReplaced() );
        pickUpDonation.setOtherInfo( dto.getOtherInfo() );

        return pickUpDonation;
    }

    public PickUpDonationReadDTO toDto(PickUpDonation pickUpDonation) {
        if ( pickUpDonation == null ) {
            return null;
        }

        PickUpDonationReadDTO pickUpDonationReadDTO = new PickUpDonationReadDTO();

        pickUpDonationReadDTO.setId( pickUpDonation.getId() );
        pickUpDonationReadDTO.setDate( pickUpDonation.getDate() );
        pickUpDonationReadDTO.setPickUpInfo( pickUpDonation.getPickUpInfo() );
        pickUpDonationReadDTO.setAmount( pickUpDonation.getAmount() );
        pickUpDonationReadDTO.setContract( pickUpDonation.getContract() );
        pickUpDonationReadDTO.setReceiptNumber( pickUpDonation.getReceiptNumber() );
        pickUpDonationReadDTO.setPhoto( pickUpDonation.getPhoto() );
        pickUpDonationReadDTO.setReplaced( pickUpDonation.getReplaced() );
        pickUpDonationReadDTO.setOtherInfo( pickUpDonation.getOtherInfo() );
        pickUpDonationReadDTO.setUser( userMapper.toDto( pickUpDonation.getUser() ) );
        pickUpDonationReadDTO.setCharityBox( charityBoxMapper.toDto( pickUpDonation.getCharityBox() ) );

        return pickUpDonationReadDTO;
    }

}
