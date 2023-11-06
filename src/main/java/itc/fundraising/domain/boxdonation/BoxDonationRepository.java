package itc.fundraising.domain.boxdonation;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BoxDonationRepository extends JpaRepository<BoxDonation, UUID> {

    BoxDonation findFirstByUser_WorkAreaOrderByReceiptNumberDesc(UserWorkArea user_workArea);
}
