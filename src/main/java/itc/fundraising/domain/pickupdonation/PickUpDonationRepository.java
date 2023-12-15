package itc.fundraising.domain.pickupdonation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;


public interface PickUpDonationRepository extends JpaRepository<PickUpDonation, UUID> {
}
