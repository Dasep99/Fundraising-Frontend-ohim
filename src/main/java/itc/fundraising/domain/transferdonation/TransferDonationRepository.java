package itc.fundraising.domain.transferdonation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransferDonationRepository extends JpaRepository<TransferDonation, UUID> {

    List<TransferDonation> findAllByOrderByDateDescUser_WorkAreaAsc();

}
