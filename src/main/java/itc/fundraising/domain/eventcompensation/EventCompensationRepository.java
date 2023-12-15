package itc.fundraising.domain.eventcompensation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;


public interface EventCompensationRepository extends JpaRepository<EventCompensation, UUID> {
}
