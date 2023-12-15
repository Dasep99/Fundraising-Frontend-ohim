package itc.fundraising.domain.cashlessexpense.dto;

import itc.fundraising.enums.CashlessItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CashlessExpenseCreateDTO {

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    private String bbkNumber;

    @NotBlank(message = "Akun wajib diisi")
    private String contract;

    @NotBlank(message = "Penyaluran wajib diisi")
    private String distribution;

    @NotEmpty(message = "Pilih setidaknya 1 item")
    private List<CashlessItem> items;

    private String bbkPhoto;

    private String otherInfo;

    @NotNull(message = "Pengguna wajib diisi")
    private UUID userId;

}
