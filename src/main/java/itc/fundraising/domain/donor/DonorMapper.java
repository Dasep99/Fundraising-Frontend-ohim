package itc.fundraising.domain.donor;

import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DonorType;
import org.springframework.stereotype.Component;

@Component
public class DonorMapper {

    private final UserMapper userMapper;

    public DonorMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Donor toDonorCreate(DonorCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Donor donor = new Donor();

        donor.setName( dto.getName().trim() );
        donor.setPhoneNumber( dto.getPhoneNumber().trim() );
        donor.setAddress( dto.getAddress().trim() );
        donor.setEmail( dto.getEmail() );
        if ( dto.getType() != null ) {
            donor.setType( Enum.valueOf( DonorType.class, dto.getType().trim() ) );
        }

        return donor;
    }

    public Donor toDonorUpdate(DonorUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Donor donor = new Donor();

        donor.setCreatedAt( dto.getCreatedAt() );
        donor.setId( dto.getId() );
        donor.setName( dto.getName().trim() );
        donor.setPhoneNumber( dto.getPhoneNumber().trim() );
        donor.setAddress( dto.getAddress().trim() );
        donor.setEmail( dto.getEmail() );
        if ( dto.getType() != null ) {
            donor.setType( Enum.valueOf( DonorType.class, dto.getType().trim() ) );
        }

        return donor;
    }

    public DonorReadDTO toDto(Donor donor) {
        if ( donor == null ) {
            return null;
        }

        DonorReadDTO donorReadDTO = new DonorReadDTO();

        donorReadDTO.setId( donor.getId() );
        donorReadDTO.setName( donor.getName() );
        donorReadDTO.setPhoneNumber( donor.getPhoneNumber() );
        donorReadDTO.setAddress( donor.getAddress() );
        donorReadDTO.setEmail( donor.getEmail() );
        donorReadDTO.setType( donor.getType() );
        donorReadDTO.setUser( userMapper.toDto( donor.getUser() ) );

        return donorReadDTO;
    }

}
