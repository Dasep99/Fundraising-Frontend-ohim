package itc.fundraising.domain.eventcompensation;

import itc.fundraising.domain.eventcompensation.dto.EventCompensationCreateDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationReadDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationUpdateDTO;
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
@RequestMapping("/api/eventCompensations")

public class EventCompensationController {

    private final EventCompensationService eventCompensationService;

    public EventCompensationController(EventCompensationService eventCompensationService) {
        this.eventCompensationService = eventCompensationService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<EventCompensationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<EventCompensationReadDTO> data = eventCompensationService.findAll(pagination);
//        ResponseDTO<List<EventCompensationReadDTO>> responseDTO = ResponseDTO.<List<EventCompensationReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<EventCompensationReadDTO>>> findAll() {
        List<EventCompensationReadDTO> data = eventCompensationService.findAll();
        ResponseDTO<List<EventCompensationReadDTO>> responseDTO = ResponseDTO.<List<EventCompensationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = eventCompensationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("bkkFile") MultipartFile bkkFile,
                                       @RequestParam("dossierFile") MultipartFile dossierFile,
                                       @Valid @ModelAttribute EventCompensationCreateDTO dto) {
        eventCompensationService.create(bkkFile, dossierFile, dto);
        return ResponseEntity.created(URI.create("/api/transferDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("bkkFile") MultipartFile bkkFile,
                                       @RequestParam("dossierFile") MultipartFile dossierFile,
                                       @Valid @ModelAttribute EventCompensationUpdateDTO dto) {
        eventCompensationService.update(dto, bkkFile, dossierFile);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        eventCompensationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
