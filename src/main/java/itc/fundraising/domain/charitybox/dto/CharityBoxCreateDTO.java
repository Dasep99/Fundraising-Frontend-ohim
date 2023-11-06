package itc.fundraising.domain.charitybox.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CharityBoxCreateDTO {

    @NotBlank(message = "Keterangan pundi wajib diisi")
    private String charityBoxInfo;

    @NotBlank(message = "Nama outlet wajib diisi")
    private String outletName;

    private String code;

    @NotBlank(message = "Alamat wajib diisi")
    private String address;

    @NotBlank(message = "Nama pemilik wajib diisi")
    private String ownerName;

    @NotBlank(message = "No telepon wajib diisi")
    private String phoneNumber;

    @NotNull(message = "Tanggal penitipan wajib diisi")
    private LocalDate depositDate;

    private String outletPhoto;

    @NotBlank(message = "Titik koordinat wajib diisi")
    private String coordinates;

    private String otherInfo;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
