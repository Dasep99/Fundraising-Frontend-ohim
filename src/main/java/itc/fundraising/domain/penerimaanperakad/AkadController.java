package itc.fundraising.domain.penerimaanperakad;

import itc.fundraising.domain.penerimaanperakad.dto.AkadCreateDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadReadDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/akads")
public class AkadController {

    private final AkadService akadService;

    public AkadController(AkadService akadService) {
        this.akadService = akadService;
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<AkadReadDTO>>> findAll() {
        List<AkadReadDTO> data = akadService.findAll();
        ResponseDTO<List<AkadReadDTO>> responseDTO = ResponseDTO.<List<AkadReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody AkadCreateDTO dto) {
        akadService.create(dto);
        return ResponseEntity.created(URI.create("/api/akads")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody AkadUpdateDTO dto) {
        akadService.update(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        akadService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
