package itc.fundraising.domain.guest;

import itc.fundraising.domain.guest.dto.GuestCreateDTO;
import itc.fundraising.domain.guest.dto.GuestReadDTO;
import itc.fundraising.domain.guest.dto.GuestUpdateDTO;
import itc.fundraising.domain.user.User;
import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.utils.FileUtil;
import itc.fundraising.utils.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@Service
@Transactional
public class GuestService {

    private static final String SUB_FOLDER = "guest";
    private final GuestRepository guestRepository;
    private final UserRepository userRepository;
    private final GuestMapper guestMapper;
    private final FileUtil fileUtil;

    public GuestService(GuestRepository guestRepository,
                        UserRepository userRepository,
                        GuestMapper guestMapper, FileUtil fileUtil) {
        this.guestRepository = guestRepository;
        this.userRepository = userRepository;
        this.guestMapper = guestMapper;
        this.fileUtil = fileUtil;
    }

    public List<GuestReadDTO> findAll() {
        List<Guest> guests = guestRepository.findAll();
        return guests.stream()
                .map(guestMapper::toDto)
                .toList();
    }

//    public GuestReadDTO findById(UUID id) {
//        return guestRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Tamu tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, GuestCreateDTO dto) {
        Guest guest = guestMapper.toGuestCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        guest.setPhoto(filename);

        save(guest, dto.getUserId());
    }

    public void update(GuestUpdateDTO dto, MultipartFile file) {
        Guest guest = guestRepository.findById(dto.getId())
                .map(g -> {
                    String oldFilename = g.getPhoto();
                    dto.setPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setCreatedAt(g.getCreatedAt());
                    return guestMapper.toGuestUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Tamu tidak ditemukan, ID: " + dto.getId()));

        save(guest, dto.getUserId());
    }

    public void deleteById(UUID id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Tamu tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(guest.getPhoto(), SUB_FOLDER);
        guestRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public GuestReadDTO mapper(Guest guest) {
//        UserReadDTO user = userMapper.toDto(guest.getUser());
//        GuestReadDTO guestReadDTO = guestMapper.toDto(guest);
//        guestReadDTO.setUser(user);
//        return guestReadDTO;
//    }

    public void save(Guest guest, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        guest.setUser(user);
        guestRepository.save(guest);
    }
}
