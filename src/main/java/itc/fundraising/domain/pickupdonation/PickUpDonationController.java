package itc.fundraising.domain.pickupdonation;

import itc.fundraising.domain.pickupdonation.dto.PickUpDonationCreateDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationReadDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationUpdateDTO;
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
@RequestMapping("/api/pickUpDonations")

public class PickUpDonationController {

    private final PickUpDonationService pickUpDonationService;

    public PickUpDonationController(PickUpDonationService pickUpDonationService) {
        this.pickUpDonationService = pickUpDonationService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<PickUpDonationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<PickUpDonationReadDTO> data = pickUpDonationService.findAll(pagination);
//        ResponseDTO<List<PickUpDonationReadDTO>> responseDTO = ResponseDTO.<List<PickUpDonationReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<PickUpDonationReadDTO>>> findAll() {
        List<PickUpDonationReadDTO> data = pickUpDonationService.findAll();
        ResponseDTO<List<PickUpDonationReadDTO>> responseDTO = ResponseDTO.<List<PickUpDonationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = pickUpDonationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute PickUpDonationCreateDTO dto) {
        pickUpDonationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/pickUpDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute PickUpDonationUpdateDTO dto) {
        pickUpDonationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        pickUpDonationService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
