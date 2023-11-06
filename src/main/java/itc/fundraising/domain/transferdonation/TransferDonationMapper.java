package itc.fundraising.domain.transferdonation;

import itc.fundraising.domain.donor.DonorMapper;
import itc.fundraising.domain.transferdonation.dto.TransferDonationCreateDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationReadDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DonationContract;
import org.springframework.stereotype.Component;

@Component
public class TransferDonationMapper {

    private final UserMapper userMapper;
    private final DonorMapper donorMapper;

    public TransferDonationMapper(UserMapper userMapper, DonorMapper donorMapper) {
        this.userMapper = userMapper;
        this.donorMapper = donorMapper;
    }

    public TransferDonation toTransferDonationCreate(TransferDonationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        TransferDonation transferDonation = new TransferDonation();

        transferDonation.setDate( dto.getDate() );
        transferDonation.setAmount( dto.getAmount() );
        if ( dto.getContract() != null ) {
            transferDonation.setContract( Enum.valueOf( DonationContract.class, dto.getContract().trim() ) );
        }
        transferDonation.setTransfersAccount( dto.getTransfersAccount().trim() );
        transferDonation.setReceiptPhoto( dto.getReceiptPhoto() );
        transferDonation.setOtherInfo( dto.getOtherInfo() );

        return transferDonation;
    }

    public TransferDonation toTransferDonationUpdate(TransferDonationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        TransferDonation transferDonation = new TransferDonation();

        transferDonation.setCreatedAt( dto.getCreatedAt() );
        transferDonation.setId( dto.getId() );
        transferDonation.setDate( dto.getDate() );
        transferDonation.setAmount( dto.getAmount() );
        if ( dto.getContract() != null ) {
            transferDonation.setContract( Enum.valueOf( DonationContract.class, dto.getContract().trim() ) );
        }
        transferDonation.setTransfersAccount( dto.getTransfersAccount().trim() );
        transferDonation.setReceiptPhoto( dto.getReceiptPhoto() );
        transferDonation.setOtherInfo( dto.getOtherInfo() );

        return transferDonation;
    }

    public TransferDonationReadDTO toDto(TransferDonation transferDonation) {
        if ( transferDonation == null ) {
            return null;
        }

        TransferDonationReadDTO transferDonationReadDTO = new TransferDonationReadDTO();

        transferDonationReadDTO.setId( transferDonation.getId() );
        transferDonationReadDTO.setDate( transferDonation.getDate() );
        transferDonationReadDTO.setContract( transferDonation.getContract() );
        transferDonationReadDTO.setAmount( transferDonation.getAmount() );
        transferDonationReadDTO.setTransfersAccount( transferDonation.getTransfersAccount() );
        transferDonationReadDTO.setReceiptPhoto( transferDonation.getReceiptPhoto() );
        transferDonationReadDTO.setOtherInfo( transferDonation.getOtherInfo() );
        transferDonationReadDTO.setUser( userMapper.toDto( transferDonation.getUser() ) );
        transferDonationReadDTO.setDonor( donorMapper.toDto( transferDonation.getDonor() ) );

        return transferDonationReadDTO;
    }

}
