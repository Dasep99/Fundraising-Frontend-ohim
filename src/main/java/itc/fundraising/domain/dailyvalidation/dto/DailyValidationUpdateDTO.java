package itc.fundraising.domain.dailyvalidation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class DailyValidationUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    @NotNull(message = "Jumlah wajib diisi")
    @Min(value = 1, message = "Jumlah wajib diisi")
    private Integer amount;

    private String validationPhoto;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
