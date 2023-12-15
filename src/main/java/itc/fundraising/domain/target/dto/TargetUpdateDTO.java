package itc.fundraising.domain.target.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class TargetUpdateDTO {
    private UUID id;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    private String unit;

    private Integer inputTarget;

    private Date createdAt;





}
