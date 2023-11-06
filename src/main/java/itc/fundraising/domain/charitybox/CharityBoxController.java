package itc.fundraising.domain.charitybox;

import itc.fundraising.domain.charitybox.dto.CharityBoxCreateDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxReadDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxUpdateDTO;
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
@RequestMapping("/api/charityBoxes")

public class CharityBoxController {

    private final CharityBoxService charityBoxService;

    public CharityBoxController(CharityBoxService charityBoxService) {
        this.charityBoxService = charityBoxService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<CharityBoxReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<CharityBoxReadDTO> data = charityBoxService.findAll(pagination);
//        ResponseDTO<List<CharityBoxReadDTO>> responseDTO = ResponseDTO.<List<CharityBoxReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<CharityBoxReadDTO>>> findAll() {
        List<CharityBoxReadDTO> data = charityBoxService.findAll();
        ResponseDTO<List<CharityBoxReadDTO>> responseDTO = ResponseDTO.<List<CharityBoxReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = charityBoxService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CharityBoxCreateDTO dto) {
        charityBoxService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/charityBoxes")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CharityBoxUpdateDTO dto) {
        charityBoxService.update(dto, file);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        charityBoxService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
