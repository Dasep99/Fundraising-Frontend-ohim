package itc.fundraising.domain.user;

import itc.fundraising.domain.user.dto.UserCreateDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.domain.user.dto.UserUpdateDTO;
import itc.fundraising.utils.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @GetMapping
//    public ResponseEntity<ResponseDTO<List<UserReadDTO>>> findAll(
//            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
//            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size) {
//        PaginationRequestDTO pagination = PaginationRequestDTO.builder()
//                .page(page)
//                .size(size)
//                .build();
//
//        Page<UserReadDTO> data = userService.findAll(pagination);
//        ResponseDTO<List<UserReadDTO>> responseDTO = ResponseDTO.<List<UserReadDTO>>builder()
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
    public ResponseEntity<ResponseDTO<List<UserReadDTO>>> findAll() {
        List<UserReadDTO> data = userService.findAll();
        ResponseDTO<List<UserReadDTO>> responseDTO = ResponseDTO.<List<UserReadDTO>>builder()
                .data(data)
                .build();
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable UUID id) {
        UserReadDTO data = userService.findById(id);
        ResponseDTO<UserReadDTO> responseDTO = ResponseDTO.<UserReadDTO>builder().data(data).build();
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserCreateDTO dto) {
        userService.create(dto);
        return ResponseEntity.created(URI.create("/api/users")).build();
    }

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody UserUpdateDTO dto) {
        userService.update(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
