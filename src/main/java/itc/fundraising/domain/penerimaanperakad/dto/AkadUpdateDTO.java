package itc.fundraising.domain.penerimaanperakad.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;
@Getter
@Setter
public class AkadUpdateDTO {
    private UUID id;
    private String unit;
    private String donationcontract;
    private Date createdAt;
}
