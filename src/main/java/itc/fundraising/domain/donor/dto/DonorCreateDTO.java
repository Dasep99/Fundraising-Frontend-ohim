package itc.fundraising.domain.donor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DonorCreateDTO {

    @NotBlank(message = "Nama wajib diisi")
    private String name;

    @NotBlank(message = "No telepon wajib diisi")
    private String phoneNumber;

    @NotBlank(message = "Alamat wajib diisi")
    private String address;

    private String email;

    @NotBlank(message = "Status donatur wajib diisi")
    private String type;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
