package itc.fundraising.domain.transferdonation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class TransferDonationCreateDTO {

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Akad wajib diisi")
    private String contract;

    @NotNull(message = "Jumlah donasi wajib diisi")
    @Min(value = 1, message = "Jumlah donasi wajib diisi")
    private Integer amount;

    @NotBlank(message = "Rekening transfer wajib diisi")
    private String transfersAccount;

    private String receiptPhoto;

    private String otherInfo;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

    @NotNull(message = "Donatur wajib diisi")
    private UUID donorId;

}
