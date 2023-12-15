package itc.fundraising.domain.user;

import itc.fundraising.domain.user.dto.UserCreateDTO;
import itc.fundraising.domain.user.dto.UserReadDTO;
import itc.fundraising.domain.user.dto.UserUpdateDTO;
import itc.fundraising.utils.ResourceNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

//    public Page<UserReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<User> users = userRepository.findAll(pageable);
//        List<UserReadDTO> data = users.getContent().stream()
//                .map(userMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, users.getTotalElements());
//    }

    public List<UserReadDTO> findAll() {
        List<User> users = userRepository.findAllByOrderByName();
        return users.stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserReadDTO findById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + id));
    }

    public void create(UserCreateDTO dto) {
        User user = userMapper.toUserCreate(dto);
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void update(UserUpdateDTO dto) {
        User user = userRepository.findById(dto.getId())
                .map(u -> {
                    dto.setWorkArea(String.valueOf(u.getWorkArea()));
                    dto.setCreatedAt(u.getCreatedAt());
                    return userMapper.toUserUpdate(dto);
                }).orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getId()));
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void deleteById(UUID id) {
        userRepository.findById(id)
                .map(u -> {
                    userRepository.deleteById(id);
                    return u;
                }).orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + id));
    }

}
