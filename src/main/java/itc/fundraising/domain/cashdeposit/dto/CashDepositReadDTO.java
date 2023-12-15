package itc.fundraising.domain.cashdeposit.dto;

import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.enums.DepositContract;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CashDepositReadDTO {

    private UUID id;

    private LocalDate date;

    private DepositContract contract;

    private Integer amount;

    private String receiptPhoto;

    private UserReadDTO user;

}
