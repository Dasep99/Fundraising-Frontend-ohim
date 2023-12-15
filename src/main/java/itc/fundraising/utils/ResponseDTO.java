package itc.fundraising.utils;

import lombok.*;

@Getter
@Setter
@Builder
public class ResponseDTO<T> {

    private T data;

    private PaginationResponseDTO page;

}
