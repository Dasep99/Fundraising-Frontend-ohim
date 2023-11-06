package itc.fundraising.domain.cashlessexpense;

import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseCreateDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseReadDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseUpdateDTO;
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
@RequestMapping("/api/cashlessExpenses")

public class CashlessExpenseController {

    private final CashlessExpenseService cashlessExpenseService;

    public CashlessExpenseController(CashlessExpenseService cashlessExpenseService) {
        this.cashlessExpenseService = cashlessExpenseService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<CashlessExpensesReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<CashlessExpenseReadDTO> data = cashlessExpenseService.findAll(pagination);
//        ResponseDTO<List<CashlessExpenseReadDTO>> responseDTO = ResponseDTO.<List<CashlessExpenseReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<CashlessExpenseReadDTO>>> findAll() {
        List<CashlessExpenseReadDTO> data = cashlessExpenseService.findAll();
        ResponseDTO<List<CashlessExpenseReadDTO>> responseDTO = ResponseDTO.<List<CashlessExpenseReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = cashlessExpenseService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashlessExpenseCreateDTO dto) {
        cashlessExpenseService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/cashlessExpenses")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashlessExpenseUpdateDTO dto) {
        cashlessExpenseService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        cashlessExpenseService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
