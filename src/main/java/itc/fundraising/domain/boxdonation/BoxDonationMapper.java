package itc.fundraising.domain.boxdonation;

import itc.fundraising.domain.boxdonation.dto.BoxDonationCreateDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationReadDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class BoxDonationMapper {

    public final UserMapper userMapper;

    public BoxDonationMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public BoxDonation toBoxDonationCreate(BoxDonationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        BoxDonation boxDonation = new BoxDonation();

        boxDonation.setDate( dto.getDate() );
        boxDonation.setReceiptNumber( dto.getReceiptNumber() );
        boxDonation.setAmount( dto.getAmount() );
        boxDonation.setReceiptPhoto( dto.getReceiptPhoto() );

        return boxDonation;
    }

    public BoxDonation toBoxDonationUpdate(BoxDonationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        BoxDonation boxDonation = new BoxDonation();

        boxDonation.setCreatedAt( dto.getCreatedAt() );
        boxDonation.setId( dto.getId() );
        boxDonation.setDate( dto.getDate() );
        boxDonation.setReceiptNumber( dto.getReceiptNumber() );
        boxDonation.setAmount( dto.getAmount() );
        boxDonation.setReceiptPhoto( dto.getReceiptPhoto() );

        return boxDonation;
    }

    public BoxDonationReadDTO toDto(BoxDonation boxDonation) {
        if ( boxDonation == null ) {
            return null;
        }

        BoxDonationReadDTO boxDonationReadDTO = new BoxDonationReadDTO();

        boxDonationReadDTO.setId( boxDonation.getId() );
        boxDonationReadDTO.setDate( boxDonation.getDate() );
        boxDonationReadDTO.setReceiptNumber( boxDonation.getReceiptNumber() );
        boxDonationReadDTO.setAmount( boxDonation.getAmount() );
        boxDonationReadDTO.setReceiptPhoto( boxDonation.getReceiptPhoto() );
        boxDonationReadDTO.setUser(userMapper.toDto(boxDonation.getUser()) );

        return boxDonationReadDTO;
    }

}
