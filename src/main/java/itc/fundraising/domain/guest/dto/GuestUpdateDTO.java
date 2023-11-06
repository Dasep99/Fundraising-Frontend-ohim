package itc.fundraising.domain.guest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class GuestUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal transaksi wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Nama wajib diisi")
    private String name;

    @NotBlank(message = "Alamat wajib diisi")
    private String address;

    @NotBlank(message = "No telepon wajib diisi")
    private String phoneNumber;

    @NotBlank(message = "Keperluan wajib diisi")
    private String purpose;

    private String photo;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
