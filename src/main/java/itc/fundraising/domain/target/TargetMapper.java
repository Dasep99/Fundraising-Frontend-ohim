package itc.fundraising.domain.target;
import itc.fundraising.domain.target.dto.TargetCreateDTO;
import itc.fundraising.domain.target.dto.TargetReadDTO;
import itc.fundraising.domain.target.dto.TargetUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.UserWorkArea;
import org.springframework.stereotype.Component;


@Component
public class TargetMapper {
    private final UserMapper userMapper;


    public TargetMapper(UserMapper userMapper) {
        this.userMapper = userMapper;

    }

    public Target toTargetCreate(TargetCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Target target = new Target();

        target.setDate( dto.getDate() );
        target.setInputTarget(dto.getInputTarget());
        if ( dto.getUnit() != null ) {
            target.setUnit( Enum.valueOf( UserWorkArea.class, dto.getUnit().trim() ) );
        }

        return target;
    }

    public Target toTargetUpdate(TargetUpdateDTO dto) {
        if (dto == null) {
            return null;
        }

        Target target = new Target();

        target.setCreatedAt( dto.getCreatedAt() );
        target.setId( dto.getId() );
        target.setDate(dto.getDate());
        target.setInputTarget(dto.getInputTarget());
        if ( dto.getUnit() != null ) {
            target.setUnit( Enum.valueOf( UserWorkArea.class, dto.getUnit().trim() ) );
        }
        return target;
    }

    public TargetReadDTO toDto(Target target) {
        if (target == null) {
            return null;
        }

        TargetReadDTO targetReadDTO = new TargetReadDTO();

        targetReadDTO.setId(target.getId());
        targetReadDTO.setDate(target.getDate());
        targetReadDTO.setUnit(target.getUnit());
        targetReadDTO.setInputTarget(target.getInputTarget());


        return targetReadDTO;
    }
}
