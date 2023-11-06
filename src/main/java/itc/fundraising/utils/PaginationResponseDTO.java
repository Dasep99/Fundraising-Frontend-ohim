package itc.fundraising.utils;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaginationResponseDTO {

    private Integer currentPage;

    private Integer totalPages;

    private Integer size;

}
