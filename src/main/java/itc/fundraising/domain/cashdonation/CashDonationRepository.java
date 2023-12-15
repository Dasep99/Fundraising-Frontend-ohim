package itc.fundraising.domain.cashdonation;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CashDonationRepository extends JpaRepository<CashDonation, UUID> {

    List<CashDonation> findAllByOrderByDateDescUser_WorkAreaAscReceiptNumberAsc();

    CashDonation findFirstByUser_WorkAreaOrderByReceiptNumberDesc(UserWorkArea workArea);
    @Query("SELECT cd FROM CashDonation cd WHERE MONTH(cd.date) = :month AND YEAR(cd.date) = :year")
    List<CashDonation> findByMonthAndYear(@Param("month") short month, @Param("year") int year);

}