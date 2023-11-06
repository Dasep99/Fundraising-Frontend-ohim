package itc.fundraising.domain.cashdeposit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CashDepositCreateDTO {

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Akad wajib diisi")
    private String contract;

    @NotNull(message = "Nominal setor wajib diisi")
    @Min(value = 1, message = "Nominal setor wajib diisi")
    private Integer amount;

    private String receiptPhoto;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
