package itc.fundraising.domain.user;

import itc.fundraising.domain.user.dto.UserCreateDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.domain.user.dto.UserUpdateDTO;
import itc.fundraising.enums.UserRole;
import itc.fundraising.enums.UserWorkArea;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toUserCreate(UserCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setName( dto.getName().trim() );
        user.setUsername( dto.getUsername().trim() );
        user.setPassword( dto.getPassword() );
        if ( dto.getRole() != null ) {
            user.setRole( Enum.valueOf( UserRole.class, dto.getRole().trim() ) );
        }
        if ( dto.getWorkArea() != null ) {
            user.setWorkArea( Enum.valueOf( UserWorkArea.class, dto.getWorkArea().trim() ) );
        }

        return user;
    }

    public User toUserUpdate(UserUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setCreatedAt( dto.getCreatedAt() );
        user.setId( dto.getId() );
        user.setName( dto.getName().trim() );
        user.setUsername( dto.getUsername().trim() );
        user.setPassword( dto.getPassword() );
        if ( dto.getRole() != null ) {
            user.setRole( Enum.valueOf( UserRole.class, dto.getRole().trim() ) );
        }
        if ( dto.getWorkArea() != null ) {
            user.setWorkArea( Enum.valueOf( UserWorkArea.class, dto.getWorkArea().trim() ) );
        }

        return user;
    }

    public UserReadDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserReadDTO userReadDTO = new UserReadDTO();

        userReadDTO.setId( user.getId() );
        userReadDTO.setName( user.getName() );
        userReadDTO.setUsername( user.getUsername() );
        userReadDTO.setRole( user.getRole() );
        userReadDTO.setWorkArea( user.getWorkArea() );

        return userReadDTO;
    }

}
