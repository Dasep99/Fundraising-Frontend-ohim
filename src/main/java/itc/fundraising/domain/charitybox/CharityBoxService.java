package itc.fundraising.domain.charitybox;

import itc.fundraising.domain.charitybox.dto.CharityBoxCreateDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxReadDTO;
import itc.fundraising.domain.charitybox.dto.CharityBoxUpdateDTO;
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
public class CharityBoxService {

    private static final String SUB_FOLDER = "charity-box";
    private final CharityBoxRepository charityBoxRepository;
    private final CharityBoxMapper charityBoxMapper;
    private final UserRepository userRepository;
    private final FileUtil fileUtil;

    public CharityBoxService(CharityBoxRepository charityBoxRepository, CharityBoxMapper charityBoxMapper, UserRepository userRepository, FileUtil fileUtil) {
        this.charityBoxRepository = charityBoxRepository;
        this.charityBoxMapper = charityBoxMapper;
        this.userRepository = userRepository;
        this.fileUtil = fileUtil;
    }

//    public Page<CharityBoxReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CharityBox> charityBoxes = charityBoxRepository.findAll(pageable);
//        List<CharityBoxReadDTO> data = charityBoxes.getContent().stream()
//                .map(charityBoxMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, charityBoxes.getTotalElements());
//    }

    public List<CharityBoxReadDTO> findAll() {
        List<CharityBox> charityBoxes = charityBoxRepository.findAll();
        return charityBoxes.stream()
                .map(charityBoxMapper::toDto)
                .toList();
    }

//    public CharityBoxReadDTO findById(UUID id) {
//        return charityBoxRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Pundi tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, CharityBoxCreateDTO dto) {
        CharityBox charityBox = charityBoxMapper.toCharityBoxCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        charityBox.setOutletPhoto(filename);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        String code = generateCharityBoxCode(user);
        charityBox.setCode(code);
        charityBox.setUser(user);

        charityBoxRepository.save(charityBox);
    }

    public void update(CharityBoxUpdateDTO dto, MultipartFile file) {
        CharityBox charityBox = charityBoxRepository.findById(dto.getId())
                .map(cb -> {
                    dto.setCode(cb.getCode());
                    String oldFilename = cb.getOutletPhoto();
                    dto.setOutletPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setCreatedAt(cb.getCreatedAt());
                    return charityBoxMapper.toCharityBoxUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Pundi tidak ditemukan, ID: " + dto.getId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        charityBox.setUser(user);

        charityBoxRepository.save(charityBox);

    }


    public void deleteById(UUID id) {
        CharityBox charityBox = charityBoxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Pundi tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(charityBox.getOutletPhoto(), SUB_FOLDER);
        charityBoxRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    MAPPING UNTUK MENAMPILKAN DATA
//    public CharityBoxReadDTO mapper(CharityBox charityBox) {
//        UserReadDTO user = userMapper.toDto(charityBox.getUser());
//        CharityBoxReadDTO charityBoxReadDTO = charityBoxMapper.toDto(charityBox);
//        charityBoxReadDTO.setUser(user);
//        return charityBoxReadDTO;
//    }

//    METHOD UNTUK MEN-GENERATE KODE PUNDI SECARA OTOMATIS
    public String generateCharityBoxCode(User user) {
        String initial = "";
        initial = switch (user.getWorkArea().name()) {
            case "CIREBON" -> "C";
            case "BEKASI" -> "B";
            case "JAKARTA" -> "J";
            case "KUNINGAN" -> "K";
            case "MAJALENGKA" -> "M";
            case "KALIMANTAN" -> "KL";
            case "SURABAYA" -> "S";
            default -> initial;
        };

        CharityBox lastCharityBox = charityBoxRepository.findFirstByUser_WorkAreaOrderByCodeDesc(user.getWorkArea());
        int lastNumber = lastCharityBox != null ? Integer.parseInt(lastCharityBox.getCode().substring(initial.length())) : 0;
        int nextNumber = lastNumber + 1;
        return initial + nextNumber;
    }

}
