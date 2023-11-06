package itc.fundraising.domain.cashlessdonation;

import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationCreateDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationReadDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationUpdateDTO;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cashlessDonations")

public class CashlessDonationController {

    private final CashlessDonationService cashlessDonationService;
    private final CashlessDonationMapper cashlessDonationMapper;

    public CashlessDonationController(CashlessDonationService cashlessDonationService, CashlessDonationMapper cashlessDonationMapper) {
        this.cashlessDonationService = cashlessDonationService;
        this.cashlessDonationMapper = cashlessDonationMapper;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<CashlessDonationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<CashlessDonationReadDTO> data = cashlessDonationService.findAll(pagination);
//        ResponseDTO<List<CashlessDonationReadDTO>> responseDTO = ResponseDTO.<List<CashlessDonationReadDTO>>builder()
//                .data(data.getContent())
//                .page(PaginationResponseDTO.builder()
//                        .currentPage(data.getNumber())
//                        .totalPages(data.getTotalPages())
//                        .size(data.getSize())
//                        .build())
//                .build();
//        return ResponseEntity.ok(responseDTO);
//    }

    @GetMapping("/findByDonorId/{donorId}")
    public ResponseEntity<List<CashlessDonationReadDTO>> findByDonorId(@PathVariable UUID donorId) {
        List<CashlessDonation> data = cashlessDonationService.findByDonorId(donorId);
        List<CashlessDonationReadDTO> dtos = data.stream()
                .map(cashlessDonation -> cashlessDonationMapper.toDto(cashlessDonation))
                .collect(Collectors.toList());

        if (dtos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<CashlessDonationReadDTO>>> findAll() {
        List<CashlessDonationReadDTO> data = cashlessDonationService.findAll();
        ResponseDTO<List<CashlessDonationReadDTO>> responseDTO = ResponseDTO.<List<CashlessDonationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = cashlessDonationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashlessDonationCreateDTO dto) {
        cashlessDonationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/cashlessDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashlessDonationUpdateDTO dto) {
        cashlessDonationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        cashlessDonationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
