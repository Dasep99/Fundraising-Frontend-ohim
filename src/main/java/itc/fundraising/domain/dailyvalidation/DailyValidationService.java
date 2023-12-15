package itc.fundraising.domain.dailyvalidation;

import itc.fundraising.domain.dailyvalidation.dto.DailyValidationCreateDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationReadDTO;
import itc.fundraising.domain.dailyvalidation.dto.DailyValidationUpdateDTO;
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
public class DailyValidationService {

    private static final String SUB_FOLDER = "daily-validation";
    private final DailyValidationRepository dailyValidationRepository;
    private final DailyValidationMapper dailyValidationMapper;
    private final UserRepository userRepository;
    private final FileUtil fileUtil;

    public DailyValidationService(DailyValidationRepository dailyValidationRepository,
                                  DailyValidationMapper dailyValidationMapper,
                                  UserRepository userRepository, FileUtil fileUtil) {
        this.dailyValidationRepository = dailyValidationRepository;
        this.dailyValidationMapper = dailyValidationMapper;
        this.userRepository = userRepository;
        this.fileUtil = fileUtil;
    }

//    public Page<DailyValidationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<DailyValidation> dailyValidations = dailyValidationRepository.findAll(pageable);
//        List<DailyValidationReadDTO> data = dailyValidations.getContent().stream()
//                .map(dailyValidationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, dailyValidations.getTotalElements());
//    }

    public List<DailyValidationReadDTO> findAll() {
        List<DailyValidation> dailyValidations = dailyValidationRepository.findAll();
        return dailyValidations.stream()
                .map(dailyValidationMapper::toDto)
                .toList();
    }

//    public DailyValidationReadDTO findById(UUID id) {
//        return dailyValidationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Validasi Harian tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, DailyValidationCreateDTO dto) {
        DailyValidation dailyValidation = dailyValidationMapper.toDailyValidationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        dailyValidation.setValidationPhoto(filename);

        save(dailyValidation, dto.getUserId());
    }

    public void update(DailyValidationUpdateDTO dto, MultipartFile file) {
        DailyValidation dailyValidation = dailyValidationRepository.findById(dto.getId())
                .map(dv -> {
                    String oldFilename = dv.getValidationPhoto();
                    dto.setValidationPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setCreatedAt(dv.getCreatedAt());
                    return dailyValidationMapper.toDailyValidationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Validasi Harian tidak ditemukan, ID: " + dto.getId()));

        save(dailyValidation, dto.getUserId());
    }

    public void deleteById(UUID id) {
        DailyValidation dailyValidation = dailyValidationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Validasi Harian tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(dailyValidation.getValidationPhoto(), SUB_FOLDER);
        dailyValidationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public DailyValidationReadDTO mapper(DailyValidation dailyValidation) {
//        UserReadDTO user = userMapper.toDto(dailyValidation.getUser());
//        DailyValidationReadDTO dailyValidationReadDTO = dailyValidationMapper.toDto(dailyValidation);
//        dailyValidationReadDTO.setUser(user);
//        return dailyValidationReadDTO;
//    }

    public void save(DailyValidation dailyValidation, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        dailyValidation.setUser(user);
        dailyValidationRepository.save(dailyValidation);
    }
}
