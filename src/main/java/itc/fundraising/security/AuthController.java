package itc.fundraising.security;

import itc.fundraising.security.dto.AuthRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<Object> authenticate(@Valid @RequestBody AuthRequestDTO requestDTO) {
        return ResponseEntity.ok(authService.authenticate(requestDTO));
    }

}
