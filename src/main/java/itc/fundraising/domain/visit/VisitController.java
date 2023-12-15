package itc.fundraising.domain.visit;


import itc.fundraising.domain.visit.dto.VisitCreateDTO;
import itc.fundraising.domain.visit.dto.VisitReadDTO;
import itc.fundraising.domain.visit.dto.VisitUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visits")

public class VisitController {

    private final VisitService visitService;

    @Autowired
    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<VisitReadDTO>>> findAll() {
        List<VisitReadDTO> data = visitService.findAll();
        ResponseDTO<List<VisitReadDTO>> responseDTO = ResponseDTO.<List<VisitReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = visitService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute VisitCreateDTO dto) {
        visitService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/visits")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam(value = "file", required = false) MultipartFile file,
                                       @Valid @ModelAttribute VisitUpdateDTO dto) {
        visitService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        visitService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
