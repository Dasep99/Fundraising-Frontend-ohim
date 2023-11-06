package itc.fundraising.domain.eventcompensation.dto;

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
public class EventCompensationUpdateDTO {

    private UUID id;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    @NotBlank(message = "Akad wajib diisi")
    private String contract;

    @NotNull(message = "Nominal santunan wajib diisi")
    @Min(value = 1, message = "Nominal santunan wajib diisi")
    private Integer amount;

    private String bkkPhoto;

    private String dossierPhoto;

    private Date createdAt;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
