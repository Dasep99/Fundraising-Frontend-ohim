package itc.fundraising.domain.cashdonation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class CashDonationUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal transaksi wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Akad wajib diisi")
    private String contract;

    private String receiptNumber;

    @NotNull(message = "Jumlah donasi wajib diisi")
    @Min(value = 1, message = "Jumlah donasi wajib diisi")
    private Integer amount;

    private String receiptPhoto;

    @NotBlank(message = "Status donasi wajib diisi")
    private String status;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

    @NotNull(message = "Donatur wajib diisi")
    private UUID donorId;

}
