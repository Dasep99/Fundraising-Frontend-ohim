package itc.fundraising.domain.cashdeposit;

import itc.fundraising.domain.cashdeposit.dto.CashDepositCreateDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositReadDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositUpdateDTO;
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
@RequestMapping("/api/cashDeposits")
public class CashDepositController {

    private final CashDepositService cashDepositService;

    public CashDepositController(CashDepositService cashDepositService) {
        this.cashDepositService = cashDepositService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<CashDepositReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<CashDepositReadDTO> data = cashDepositService.findAll(pagination);
//        ResponseDTO<List<CashDepositReadDTO>> responseDTO = ResponseDTO.<List<CashDepositReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<CashDepositReadDTO>>> findAll() {
        List<CashDepositReadDTO> data = cashDepositService.findAll();
        ResponseDTO<List<CashDepositReadDTO>> responseDTO = ResponseDTO.<List<CashDepositReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = CashDepositService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashDepositCreateDTO dto) {
        cashDepositService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/cashDeposits")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashDepositUpdateDTO dto) {
        cashDepositService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        cashDepositService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
