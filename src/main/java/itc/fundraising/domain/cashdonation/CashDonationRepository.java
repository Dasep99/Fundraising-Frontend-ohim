package itc.fundraising.domain.cashdonation;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface CashDonationRepository extends JpaRepository<CashDonation, UUID> {

    CashDonation findFirstByUser_WorkAreaOrderByReceiptNumberDesc(UserWorkArea workArea);


    List<CashDonation> findByDonorId(UUID uuid);
}