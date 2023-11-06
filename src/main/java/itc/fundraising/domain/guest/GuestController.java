package itc.fundraising.domain.guest;


import itc.fundraising.domain.guest.dto.GuestCreateDTO;
import itc.fundraising.domain.guest.dto.GuestReadDTO;
import itc.fundraising.domain.guest.dto.GuestUpdateDTO;
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
@RequestMapping("/api/guests")

public class GuestController {

    private final GuestService guestService;

    @Autowired
    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<GuestReadDTO>>> findAll() {
        List<GuestReadDTO> data = guestService.findAll();
        ResponseDTO<List<GuestReadDTO>> responseDTO = ResponseDTO.<List<GuestReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = guestService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute GuestCreateDTO dto) {
        guestService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/guests")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute GuestUpdateDTO dto) {
        guestService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        guestService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
