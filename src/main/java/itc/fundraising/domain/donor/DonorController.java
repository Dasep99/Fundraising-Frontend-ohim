package itc.fundraising.domain.donor;

import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<DonorReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<DonorReadDTO> data = donorService.findAll(pagination);
//        ResponseDTO<List<DonorReadDTO>> responseDto = ResponseDTO.<List<DonorReadDTO>>builder()
//                .data(data.getContent())
//                .page(PaginationResponseDTO.builder()
//                        .currentPage(data.getNumber())
//                        .totalPages(data.getTotalPages())
//                        .size(data.getSize())
//                        .build())
//                .build();
//        return ResponseEntity.ok(responseDto);
//    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<DonorReadDTO>>> findAll() {
        List<DonorReadDTO> data = donorService.findAll();
        ResponseDTO<List<DonorReadDTO>> responseDTO = ResponseDTO.<List<DonorReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Object> findById(@PathVariable UUID id) {
//        DonorReadDTO data = donorService.findById(id);
//        ResponseDTO<DonorReadDTO> responseDto = ResponseDTO.<DonorReadDTO>builder().data(data).build();
//        return ResponseEntity.ok(responseDto);
//    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody DonorCreateDTO dto) {
        donorService.create(dto);
        return ResponseEntity.created(URI.create("/api/donors")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody DonorUpdateDTO dto) {
        donorService.update(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        donorService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
