package itc.fundraising.domain.transferdonation;

import itc.fundraising.domain.transferdonation.dto.TransferDonationCreateDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationReadDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationUpdateDTO;
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
@RequestMapping("/api/transferDonations")

public class TransferDonationController {

    private final TransferDonationService transferDonationService;
    private final TransferDonationMapper transferDonationMapper;

    public TransferDonationController(TransferDonationService transferDonationService, TransferDonationMapper transferDonationMapper) {
        this.transferDonationService = transferDonationService;
        this.transferDonationMapper = transferDonationMapper;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<TransferDonationReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<TransferDonationReadDTO> data = transferDonationService.findAll(pagination);
//        ResponseDTO<List<TransferDonationReadDTO>> responseDTO = ResponseDTO.<List<TransferDonationReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<TransferDonationReadDTO>>> findAll() {
        List<TransferDonationReadDTO> data = transferDonationService.findAll();
        ResponseDTO<List<TransferDonationReadDTO>> responseDTO = ResponseDTO.<List<TransferDonationReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/findByDonorId/{donorId}")
    public ResponseEntity<List<TransferDonationReadDTO>> findByDonorId(@PathVariable UUID donorId) {
        List<TransferDonation> data = transferDonationService.findByDonorId(donorId);
        List<TransferDonationReadDTO> dtos = data.stream()
                .map(transferDonation -> transferDonationMapper.toDto(transferDonation))
                .collect(Collectors.toList());

        if (dtos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = transferDonationService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Void> create(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute TransferDonationCreateDTO dto) {
        transferDonationService.create(file, dto);
        return ResponseEntity.created(URI.create("/api/transferDonations")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestParam("file") MultipartFile file,
                                       @Valid @ModelAttribute TransferDonationUpdateDTO dto) {
        transferDonationService.update(dto, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        transferDonationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
