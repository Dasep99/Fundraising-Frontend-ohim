package itc.fundraising.domain.eventcompensation;

import itc.fundraising.domain.eventcompensation.dto.EventCompensationCreateDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationReadDTO;
import itc.fundraising.domain.eventcompensation.dto.EventCompensationUpdateDTO;
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
public class EventCompensationService {

    private static final String SUB_FOLDER = "event-compensation";
    private final EventCompensationRepository eventCompensationRepository;
    private final UserRepository userRepository;
    private final EventCompensationMapper eventCompensationMapper;
    private final FileUtil fileUtil;

    public EventCompensationService(
            EventCompensationRepository eventCompensationRepository,
            UserRepository userRepository,
            EventCompensationMapper eventCompensationMapper, FileUtil fileUtil) {
        this.eventCompensationRepository = eventCompensationRepository;
        this.userRepository = userRepository;
        this.eventCompensationMapper = eventCompensationMapper;
        this.fileUtil = fileUtil;
    }

//    public Page<EventCompensationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<EventCompensation> eventCompensations = eventCompensationRepository.findAll(pageable);
//        List<EventCompensationReadDTO> data = eventCompensations.getContent().stream()
//                .map(eventCompensationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, eventCompensations.getTotalElements());
//    }

    public List<EventCompensationReadDTO> findAll() {
        List<EventCompensation> eventCompensations = eventCompensationRepository.findAll();
        return eventCompensations.stream()
                .map(eventCompensationMapper::toDto)
                .toList();
    }

//    public EventCompensationReadDTO findById(UUID id) {
//        return eventCompensationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Santunan Acara tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile bkkFile, MultipartFile dossierFile, EventCompensationCreateDTO dto) {
        EventCompensation eventCompensation = eventCompensationMapper.toEventCompensationCreate(dto);

        String bkkFilename = fileUtil.createFile(bkkFile, SUB_FOLDER);
        String dossierFilename = fileUtil.createFile(dossierFile, SUB_FOLDER);
        eventCompensation.setBkkPhoto(bkkFilename);
        eventCompensation.setDossierPhoto(dossierFilename);

        save(eventCompensation, dto.getUserId());
    }

    public void update(EventCompensationUpdateDTO dto, MultipartFile bkkFile,  MultipartFile dossierFile) {
        EventCompensation eventCompensation = eventCompensationRepository.findById(dto.getId())
                .map(ec -> {
                    String oldBkkFilename = ec.getBkkPhoto();
                    String oldDossierFilename = ec.getDossierPhoto();
                    dto.setBkkPhoto(fileUtil.updateFile(bkkFile, oldBkkFilename, SUB_FOLDER));
                    dto.setDossierPhoto(fileUtil.updateFile(dossierFile, oldDossierFilename, SUB_FOLDER));
                    dto.setCreatedAt(ec.getCreatedAt());
                    return eventCompensationMapper.toEventCompensationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Santunan Acara tidak ditemukan, ID: " + dto.getId()));

        save(eventCompensation, dto.getUserId());
    }

    public void deleteById(UUID id) {
        EventCompensation eventCompensation = eventCompensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Santunan Acara tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(eventCompensation.getBkkPhoto(), SUB_FOLDER);
        fileUtil.deleteFile(eventCompensation.getDossierPhoto(), SUB_FOLDER);
        eventCompensationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public EventCompensationReadDTO mapper(EventCompensation eventCompensation) {
//        UserReadDTO user = userMapper.toDto(eventCompensation.getUser());
//        EventCompensationReadDTO eventCompensationReadDTO = eventCompensationMapper.toDto(eventCompensation);
//        eventCompensationReadDTO.setUser(user);
//        return eventCompensationReadDTO;
//    }

    public void save(EventCompensation eventCompensation, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        eventCompensation.setUser(user);
        eventCompensationRepository.save(eventCompensation);
    }
}
