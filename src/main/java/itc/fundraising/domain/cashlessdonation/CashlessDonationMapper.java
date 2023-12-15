package itc.fundraising.domain.cashlessdonation;

import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationCreateDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationReadDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationUpdateDTO;
import itc.fundraising.domain.donor.DonorMapper;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.CashlessContract;
import itc.fundraising.enums.CashlessItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CashlessDonationMapper {

    private final UserMapper userMapper;
    private final DonorMapper donorMapper;

    public CashlessDonationMapper(UserMapper userMapper, DonorMapper donorMapper) {
        this.userMapper = userMapper;
        this.donorMapper = donorMapper;
    }

    public CashlessDonation toCashlessDonationCreate(CashlessDonationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashlessDonation cashlessDonation = new CashlessDonation();

        cashlessDonation.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            cashlessDonation.setContract( Enum.valueOf( CashlessContract.class, dto.getContract().trim() ) );
        }
        List<CashlessItem> list = dto.getItems();
        if ( list != null ) {
            cashlessDonation.setItems(new ArrayList<>(list) );
        }
        cashlessDonation.setReceiptNumber( dto.getReceiptNumber() );
        cashlessDonation.setReceiptPhoto( dto.getReceiptPhoto() );
        cashlessDonation.setOtherInfo( dto.getOtherInfo() );

        return cashlessDonation;
    }

    public CashlessDonation toCashlessDonationUpdate(CashlessDonationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashlessDonation cashlessDonation = new CashlessDonation();

        cashlessDonation.setCreatedAt( dto.getCreatedAt() );
        cashlessDonation.setId( dto.getId() );
        cashlessDonation.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            cashlessDonation.setContract( Enum.valueOf( CashlessContract.class, dto.getContract().trim() ) );
        }
        List<CashlessItem> list = dto.getItems();
        if ( list != null ) {
            cashlessDonation.setItems(new ArrayList<>(list) );
        }
        cashlessDonation.setReceiptNumber( dto.getReceiptNumber() );
        cashlessDonation.setReceiptPhoto( dto.getReceiptPhoto() );
        cashlessDonation.setOtherInfo( dto.getOtherInfo() );

        return cashlessDonation;
    }

    public CashlessDonationReadDTO toDto(CashlessDonation cashlessDonation) {
        if ( cashlessDonation == null ) {
            return null;
        }

        CashlessDonationReadDTO cashlessDonationReadDTO = new CashlessDonationReadDTO();

        cashlessDonationReadDTO.setId( cashlessDonation.getId() );
        cashlessDonationReadDTO.setDate( cashlessDonation.getDate() );
        cashlessDonationReadDTO.setContract( cashlessDonation.getContract() );
        List<CashlessItem> list = cashlessDonation.getItems();
        if ( list != null ) {
            cashlessDonationReadDTO.setItems(new ArrayList<>(list) );
        }
        cashlessDonationReadDTO.setReceiptNumber( cashlessDonation.getReceiptNumber() );
        cashlessDonationReadDTO.setReceiptPhoto( cashlessDonation.getReceiptPhoto() );
        cashlessDonationReadDTO.setOtherInfo( cashlessDonation.getOtherInfo() );
        cashlessDonationReadDTO.setUser( userMapper.toDto( cashlessDonation.getUser() ) );
        cashlessDonationReadDTO.setDonor( donorMapper.toDto( cashlessDonation.getDonor() ) );

        return cashlessDonationReadDTO;
    }

}
