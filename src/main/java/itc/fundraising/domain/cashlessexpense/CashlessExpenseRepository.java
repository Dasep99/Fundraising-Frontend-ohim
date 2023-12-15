package itc.fundraising.domain.cashlessexpense;

import itc.fundraising.enums.UserWorkArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CashlessExpenseRepository extends JpaRepository<CashlessExpense, UUID> {

    CashlessExpense findFirstByUser_WorkAreaOrderByBbkNumberDesc(UserWorkArea workArea);
}
