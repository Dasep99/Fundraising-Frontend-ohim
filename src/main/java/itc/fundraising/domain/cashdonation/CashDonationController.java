package itc.fundraising.domain.cashdonation;

import itc.fundraising.domain.cashdonation.dto.CashDonationCreateDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationReadDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationUpdateDTO;
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
@RequestMapping("/api/cashDonations")

public class CashDonationController {

    private final CashDonationService cashDonationService;
    private final CashDonationMapper cashDonationMapper;

    public CashDonationController(CashDonationService cashDonationService, CashDonationMapper cashDonationMapper) {
        this.cashDonationService = cashDonationService;
        this.cashDonationMapper = cashDonationMapper;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<CashDonationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<CashDonationReadDTO> data = cashDonationService.findAll(pagination);
//        ResponseDTO<List<CashDonationReadDTO>> responseDTO = ResponseDTO.<List<CashDonationReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<CashDonationReadDTO>>> findAll() {
        List<CashDonationReadDTO> data = cashDonationService.findAll();
        ResponseDTO<List<CashDonationReadDTO>> responseDTO = ResponseDTO.<List<CashDonationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/findByDonorId/{donorId}")
    public ResponseEntity<List<CashDonationReadDTO>> findByDonorId(@PathVariable UUID donorId) {
        List<CashDonation> data = cashDonationService.findByDonorId(donorId);
        List<CashDonationReadDTO> dtos = data.stream()
                .map(cashDonation -> cashDonationMapper.toDto(cashDonation))
                .collect(Collectors.toList());

        if (dtos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dtos);
    }




    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = cashDonationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashDonationCreateDTO dto) {
        cashDonationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/cashDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute CashDonationUpdateDTO dto) {
        cashDonationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        cashDonationService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
