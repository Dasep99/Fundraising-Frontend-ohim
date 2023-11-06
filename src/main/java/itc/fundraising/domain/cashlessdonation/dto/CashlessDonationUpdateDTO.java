package itc.fundraising.domain.cashlessdonation.dto;

import itc.fundraising.enums.CashlessItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CashlessDonationUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Akun wajib diisi")
    private String contract;

    @NotEmpty(message = "Pilih setidaknya 1 item")
    private List<CashlessItem> items;

    private String receiptNumber;

    private String receiptPhoto;

    private String otherInfo;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

    @NotNull(message = "Donatur wajib diisi")
    private UUID donorId;

}
