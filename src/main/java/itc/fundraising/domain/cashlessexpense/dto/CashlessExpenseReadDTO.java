package itc.fundraising.domain.cashlessexpense.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.CashlessItem;
import itc.fundraising.enums.ExpenseDistribution;
import itc.fundraising.enums.ExpenseContract;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CashlessExpenseReadDTO {

    private UUID id;

    private LocalDate date;

    private String bbkNumber;

    private ExpenseContract contract;

    private ExpenseDistribution distribution;

    private List<CashlessItem> items;

    private String bbkPhoto;

    private String otherInfo;

    private UserReadDTO user;

}
