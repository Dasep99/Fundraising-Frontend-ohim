package itc.fundraising.domain.cashdeposit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;


public interface CashDepositRepository extends JpaRepository<CashDeposit, UUID> {
}
