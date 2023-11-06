package itc.fundraising.domain.pickupdonation;

import itc.fundraising.domain.charitybox.CharityBox;
import itc.fundraising.domain.charitybox.CharityBoxRepository;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationCreateDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationReadDTO;
import itc.fundraising.domain.pickupdonation.dto.PickUpDonationUpdateDTO;
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
public class PickUpDonationService {

    private static final String SUB_FOLDER = "pickup-donation";
    private final PickUpDonationRepository pickUpDonationRepository;
    private final UserRepository userRepository;
    private final PickUpDonationMapper pickUpDonationMapper;
    private final CharityBoxRepository charityBoxRepository;
    private final FileUtil fileUtil;

    public PickUpDonationService(PickUpDonationRepository pickUpDonationRepository,
                                 UserRepository userRepository, PickUpDonationMapper pickUpDonationMapper,
                                 CharityBoxRepository charityBoxRepository, FileUtil fileUtil) {
        this.pickUpDonationRepository = pickUpDonationRepository;
        this.userRepository = userRepository;
        this.pickUpDonationMapper = pickUpDonationMapper;
        this.charityBoxRepository = charityBoxRepository;
        this.fileUtil = fileUtil;
    }

//    public Page<PickUpDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<PickUpDonation> pickUpDonations = pickUpDonationRepository.findAll(pageable);
//        List<PickUpDonationReadDTO> data = pickUpDonations.getContent().stream()
//                .map(pickUpDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, pickUpDonations.getTotalElements());
//    }

    public List<PickUpDonationReadDTO> findAll() {
        List<PickUpDonation> pickUpDonations = pickUpDonationRepository.findAll();
        return pickUpDonations.stream()
                .map(pickUpDonationMapper::toDto)
                .toList();
    }

//    public PickUpDonationReadDTO findById(UUID id) {
//        return pickUpDonationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, PickUpDonationCreateDTO dto) {
        PickUpDonation pickUpDonation = pickUpDonationMapper.toPickUpDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        pickUpDonation.setPhoto(filename);

        save(pickUpDonation, dto.getUserId(), dto.getCharityBoxId());
    }

    public void update(PickUpDonationUpdateDTO dto, MultipartFile file) {
        PickUpDonation pickUpDonation = pickUpDonationRepository.findById(dto.getId())
                .map(pd -> {
                    String oldFilename = pd.getPhoto();
                    dto.setPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setCreatedAt(pd.getCreatedAt());
                    return pickUpDonationMapper.toPickUpDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi tidak ditemukan, ID: " + dto.getId()));

        save(pickUpDonation, dto.getUserId(), dto.getCharityBoxId());
    }

    public void deleteById(UUID id) {
        PickUpDonation pickUpDonation = pickUpDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(pickUpDonation.getPhoto(), SUB_FOLDER);
        pickUpDonationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    MAPPING UNTUK MENAMPILKAN DATA
//    public PickUpDonationReadDTO mapper(PickUpDonation pickUpDonation){
//            UserReadDTO user = userMapper.toDto(pickUpDonation.getUser());
//            PickUpDonationReadDTO pickUpDonationReadDTO = pickUpDonationMapper.toDto(pickUpDonation);
//            pickUpDonationReadDTO.setUser(user);
//            return pickUpDonationReadDTO;
//        }

//    METHOD UNTUK MENYIMPAN DATA (INSERT DAN UPDATE)
    public void save (PickUpDonation pickUpDonation, UUID userId, UUID charityBoxId){
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
            CharityBox charityBox = charityBoxRepository.findById(charityBoxId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data Pundi tidak ditemukan, ID: " + charityBoxId));
            pickUpDonation.setUser(user);
            pickUpDonation.setCharityBox(charityBox);
            pickUpDonationRepository.save(pickUpDonation);
        }

    }

