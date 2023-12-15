package itc.fundraising.domain.cashlessdonation;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CashlessDonationRepository extends JpaRepository<CashlessDonation, UUID> {

    CashlessDonation findFirstByUser_WorkAreaOrderByReceiptNumberDesc(UserWorkArea user_workArea);
}
