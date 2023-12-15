package itc.fundraising.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateDTO {

    @NotBlank(message = "Nama wajib diisi")
    private String name;

    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username tidak valid. Gunakan huruf, angka, atau underscore (_)")
    private String username;

    @Size(min = 6, message = "Password minimal berisi 6 karakter")
    private String password;

    @NotBlank(message = "Level wajib diisi")
    private String role;

    @NotBlank(message = "Unit wajib diisi")
    private String workArea;

}
