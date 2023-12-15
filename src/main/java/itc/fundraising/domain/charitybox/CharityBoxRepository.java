package itc.fundraising.domain.charitybox;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;

public interface CharityBoxRepository extends JpaRepository<CharityBox, UUID> {

    CharityBox findFirstByUser_WorkAreaOrderByCodeDesc(UserWorkArea user_workArea);
}