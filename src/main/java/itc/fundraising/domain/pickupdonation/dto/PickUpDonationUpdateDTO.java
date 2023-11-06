package itc.fundraising.domain.pickupdonation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Setter
@Getter
public class PickUpDonationUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal transaksi wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Keterangan pundi wajib diisi")
    private String pickUpInfo;

//    @NotNull(message = "Jumlah donasi wajib diisi")
//    @Min(value = 1, message = "Jumlah donasi wajib diisi")
    private Integer amount;

//    @NotBlank(message = "Akad wajib diisi")
    private String contract;

    private String receiptNumber;

    private String photo;

    private String replaced;

    private String otherInfo;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

    @NotNull(message = "Pundi wajib diisi")
    private UUID charityBoxId;

}
