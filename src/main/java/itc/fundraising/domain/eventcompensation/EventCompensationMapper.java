package itc.fundraising.domain.eventcompensation;

import itc.fundraising.domain.eventcompensation.dto.EventCompensationCreateDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationReadDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.EventContract;
import org.springframework.stereotype.Component;

@Component
public class EventCompensationMapper {

    private final UserMapper userMapper;

    public EventCompensationMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public EventCompensation toEventCompensationCreate(EventCompensationCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        EventCompensation eventCompensation = new EventCompensation();

        eventCompensation.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            eventCompensation.setContract( Enum.valueOf( EventContract.class, dto.getContract().trim() ) );
        }
        eventCompensation.setAmount( dto.getAmount() );
        eventCompensation.setBkkPhoto( dto.getBkkPhoto() );
        eventCompensation.setDossierPhoto( dto.getDossierPhoto() );

        return eventCompensation;
    }

    public EventCompensation toEventCompensationUpdate(EventCompensationUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        EventCompensation eventCompensation = new EventCompensation();

        eventCompensation.setCreatedAt( dto.getCreatedAt() );
        eventCompensation.setId( dto.getId() );
        eventCompensation.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            eventCompensation.setContract( Enum.valueOf( EventContract.class, dto.getContract().trim() ) );
        }
        eventCompensation.setAmount( dto.getAmount() );
        eventCompensation.setBkkPhoto( dto.getBkkPhoto() );
        eventCompensation.setDossierPhoto( dto.getDossierPhoto() );

        return eventCompensation;
    }

    public EventCompensationReadDTO toDto(EventCompensation eventCompensation) {
        if ( eventCompensation == null ) {
            return null;
        }

        EventCompensationReadDTO eventCompensationReadDTO = new EventCompensationReadDTO();

        eventCompensationReadDTO.setId( eventCompensation.getId() );
        eventCompensationReadDTO.setDate( eventCompensation.getDate() );
        eventCompensationReadDTO.setContract( eventCompensation.getContract() );
        eventCompensationReadDTO.setAmount( eventCompensation.getAmount() );
        eventCompensationReadDTO.setBkkPhoto( eventCompensation.getBkkPhoto() );
        eventCompensationReadDTO.setDossierPhoto( eventCompensation.getDossierPhoto() );
        eventCompensationReadDTO.setUser( userMapper.toDto( eventCompensation.getUser() ) );

        return eventCompensationReadDTO;
    }

}
