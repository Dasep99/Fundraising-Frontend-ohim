package itc.fundraising.domain.dailyvalidation;

import itc.fundraising.domain.dailyvalidation.dto.DailyValidationCreateDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationReadDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dailyValidations")

public class DailyValidationController {

    private final DailyValidationService dailyValidationService;

    public DailyValidationController(DailyValidationService dailyValidationService) {
        this.dailyValidationService = dailyValidationService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<DailyValidationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<DailyValidationReadDTO> data = dailyValidationService.findAll(pagination);
//        ResponseDTO<List<DailyValidationReadDTO>> responseDTO = ResponseDTO.<List<DailyValidationReadDTO>>builder()
//                .data(data.getContent())
//                .page(PaginationResponseDTO.builder()
//                        .currentPage(data.getNumber())
//                        .totalPages(data.getTotalPages())
//                        .size(data.getSize())
//                        .build())
//                .build();
//        return ResponseEntity.ok(responseDTO);
//    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<DailyValidationReadDTO>>> findAll() {
        List<DailyValidationReadDTO> data = dailyValidationService.findAll();
        ResponseDTO<List<DailyValidationReadDTO>> responseDTO = ResponseDTO.<List<DailyValidationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = dailyValidationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute DailyValidationCreateDTO dto) {
        dailyValidationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/dailyValidations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute DailyValidationUpdateDTO dto) {
        dailyValidationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        dailyValidationService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}