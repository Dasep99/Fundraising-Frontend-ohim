package itc.fundraising.domain.dailyvalidation;

import itc.fundraising.domain.dailyvalidation.dto.DailyValidationCreateDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationReadDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class DailyValidationMapper {

    private final UserMapper userMapper;

    public DailyValidationMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public DailyValidation toDailyValidationCreate(DailyValidationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        DailyValidation dailyValidation = new DailyValidation();

        dailyValidation.setDate( dto.getDate() );
        dailyValidation.setAmount( dto.getAmount() );
        dailyValidation.setValidationPhoto( dto.getValidationPhoto() );

        return dailyValidation;
    }

    public DailyValidation toDailyValidationUpdate(DailyValidationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        DailyValidation dailyValidation = new DailyValidation();

        dailyValidation.setCreatedAt( dto.getCreatedAt() );
        dailyValidation.setId( dto.getId() );
        dailyValidation.setDate( dto.getDate() );
        dailyValidation.setAmount( dto.getAmount() );
        dailyValidation.setValidationPhoto( dto.getValidationPhoto() );

        return dailyValidation;
    }

    public DailyValidationReadDTO toDto(DailyValidation dailyValidation) {
        if ( dailyValidation == null ) {
            return null;
        }

        DailyValidationReadDTO dailyValidationReadDTO = new DailyValidationReadDTO();

        dailyValidationReadDTO.setId( dailyValidation.getId() );
        dailyValidationReadDTO.setDate( dailyValidation.getDate() );
        dailyValidationReadDTO.setAmount( dailyValidation.getAmount() );
        dailyValidationReadDTO.setValidationPhoto( dailyValidation.getValidationPhoto() );
        dailyValidationReadDTO.setUser( userMapper.toDto( dailyValidation.getUser() ) );

        return dailyValidationReadDTO;
    }

}
