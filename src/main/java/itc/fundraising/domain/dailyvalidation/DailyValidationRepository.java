package itc.fundraising.domain.dailyvalidation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;


public interface DailyValidationRepository extends JpaRepository<DailyValidation, UUID> {
}