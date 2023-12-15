package itc.fundraising.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class UserUpdateDTO {

    private UUID id;

    @NotBlank(message = "Nama wajib diisi")
    private String name;

    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username tidak valid. Gunakan huruf, angka, atau underscore (_)")
    private String username;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 6, message = "Password minimal berisi 6 karakter")
    private String password;

    @NotBlank(message = "Level wajib diisi")
    private String role;

    private String workArea;

    private Date createdAt;

}
