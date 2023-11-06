package itc.fundraising.domain.boxdonation;

import itc.fundraising.domain.boxdonation.dto.BoxDonationCreateDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationReadDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationUpdateDTO;
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
@RequestMapping("/api/boxDonations")
public class BoxDonationController {

    private final BoxDonationService boxDonationService;

    public BoxDonationController(BoxDonationService boxDonationService) {
        this.boxDonationService = boxDonationService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<BoxDonationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<BoxDonationReadDTO> data = boxDonationService.findAll(pagination);
//        ResponseDTO<List<BoxDonationReadDTO>> responseDTO = ResponseDTO.<List<BoxDonationReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<BoxDonationReadDTO>>> findAll() {
        List<BoxDonationReadDTO> data = boxDonationService.findAll();
        ResponseDTO<List<BoxDonationReadDTO>> responseDTO = ResponseDTO.<List<BoxDonationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = boxDonationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute BoxDonationCreateDTO dto) {
        boxDonationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/boxDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute BoxDonationUpdateDTO dto) {
        boxDonationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        boxDonationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
