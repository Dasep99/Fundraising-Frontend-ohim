package itc.fundraising.domain.donor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class DonorUpdateDTO {

    private UUID id;

    private String donorId;

    @Pattern(regexp = "^$|.{16}$", message = "NIK harus berisi 16 karakter")
    private String nik;

    @NotBlank(message = "Nama wajib diisi")
    private String name;

    private String gender;

    private LocalDate birthDate;

    private String phoneNumber;

    private String street;

    private String provinceId;

    private String regencyId;

    private String districtId;

    private String villageId;

    @Email(message = "Format email tidak sesuai")
    private String email;

    private String job;

    @NotBlank(message = "Jenis donatur wajib diisi")
    private String type;

    private String otherInfo;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
