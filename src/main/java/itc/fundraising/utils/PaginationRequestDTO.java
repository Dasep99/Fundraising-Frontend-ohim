package itc.fundraising.utils;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaginationRequestDTO {

    @NotNull(message = "Page wajib diisi")
    private Integer page;

    @NotNull(message = "Size wajib diisi")
    private Integer size;

}
