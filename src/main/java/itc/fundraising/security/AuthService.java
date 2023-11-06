package itc.fundraising.security;

import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.security.dto.AuthRequestDTO;
import itc.fundraising.security.dto.AuthResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO authenticate(AuthRequestDTO dto) {
        var user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Data User tidak ditemukan, username: " + dto.getUsername()));
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                dto.getUsername(),
                dto.getPassword(),
                user.getAuthorities()
        ));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponseDTO.builder()
                .id(user.getId())
                .token(jwtToken)
                .role(String.valueOf(user.getRole()))
                .name(user.getName())
                .work_area(user.getWorkArea().toString())
                .build();
    }

}
