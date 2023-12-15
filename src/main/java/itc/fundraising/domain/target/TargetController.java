package itc.fundraising.domain.target;

import itc.fundraising.domain.target.dto.TargetCreateDTO;
import itc.fundraising.domain.target.dto.TargetReadDTO;
import itc.fundraising.domain.target.dto.TargetUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/targets")

public class TargetController {

    private final TargetService targetService;

    public TargetController(TargetService targetService) {
        this.targetService = targetService;
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<TargetReadDTO>>> findAll() {
        List<TargetReadDTO> data = targetService.findAll();
        ResponseDTO<List<TargetReadDTO>> responseDTO = ResponseDTO.<List<TargetReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody TargetCreateDTO dto) {
        targetService.create(dto);
        return ResponseEntity.created(URI.create("/api/targets")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody TargetUpdateDTO dto) {
        targetService.update(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        targetService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
