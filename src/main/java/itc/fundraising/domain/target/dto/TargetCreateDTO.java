package itc.fundraising.domain.target.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class TargetCreateDTO {
    @NotNull(message = "Tanggal target wajib diisi")
    private LocalDate date;

    private String unit;

    private Integer inputTarget;



}
