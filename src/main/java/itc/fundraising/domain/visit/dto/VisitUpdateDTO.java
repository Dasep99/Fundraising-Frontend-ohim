package itc.fundraising.domain.visit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class VisitUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal transaksi wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Keperluan wajib diisi")
    private String purpose;

    private String photo;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

    @NotNull(message = "Donatur wajib diisi")
    private UUID donorId;

}
