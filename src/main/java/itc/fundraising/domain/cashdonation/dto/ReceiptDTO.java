package itc.fundraising.domain.cashdonation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReceiptDTO {

    private String receiptNumber;

    private String donorName;

    private String amountLong;

    private String amountShort;

    private String date;

}
