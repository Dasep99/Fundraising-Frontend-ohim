package itc.fundraising.domain.penerimaanperakad;

import itc.fundraising.domain.penerimaanperakad.dto.AkadCreateDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadReadDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DepositContract;
import itc.fundraising.enums.DonationContract;
import itc.fundraising.enums.UserWorkArea;
import org.springframework.stereotype.Component;

@Component
public class AkadMapper {

    private final UserMapper userMapper;

    public AkadMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Akad toAkadCreate(AkadCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }
        Akad akad = new Akad();

        if ( dto.getDonationcontract() != null ) {
            akad.setAkadContract( Enum.valueOf( DepositContract.class, dto.getDonationcontract().trim() ) );
        }
        if ( dto.getUnit() != null ) {
            akad.setUnit( Enum.valueOf( UserWorkArea.class, dto.getUnit().trim() ) );
        }
        return akad;
    }

    public Akad toAkadUpdate(AkadUpdateDTO dto) {
        if (dto == null) {
            return null;
        }

        Akad akad = new Akad();

        if ( dto.getDonationcontract() != null ) {
            akad.setAkadContract( Enum.valueOf( DepositContract.class, dto.getDonationcontract().trim() ) );
        }
        if ( dto.getUnit() != null ) {
            akad.setUnit( Enum.valueOf( UserWorkArea.class, dto.getUnit().trim() ) );
        }
        return akad;
    }

    public AkadReadDTO toDto(Akad akad) {
        if (akad == null) {
            return null;
        }

        AkadReadDTO akadReadDTO = new AkadReadDTO();

        akadReadDTO.setId(akad.getId());
        akadReadDTO.setUnit(akad.getUnit());
        akadReadDTO.setDonationcontract(akad.getAkadContract());



        return akadReadDTO;
    }
}
