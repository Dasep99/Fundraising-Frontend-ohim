package itc.fundraising.domain.boxdonation;

import itc.fundraising.domain.boxdonation.dto.BoxDonationCreateDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationReadDTO;
import itc.fundraising.domain.boxdonation.dto.BoxDonationUpdateDTO;
import itc.fundraising.domain.cashdonation.CashDonation;
import itc.fundraising.domain.cashdonation.CashDonationRepository;
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
public class BoxDonationService {

    private static final String SUB_FOLDER = "box-donation";
    private final BoxDonationRepository boxDonationRepository;
    private final UserRepository userRepository;
    private final BoxDonationMapper boxDonationMapper;
    private final FileUtil fileUtil;
    private final CashDonationRepository cashDonationRepository;

    public BoxDonationService(BoxDonationRepository boxDonationRepository,
                              UserRepository userRepository,
                              BoxDonationMapper boxDonationMapper, FileUtil fileUtil, CashDonationRepository cashDonationRepository) {
        this.boxDonationRepository = boxDonationRepository;
        this.userRepository = userRepository;
        this.boxDonationMapper = boxDonationMapper;
        this.fileUtil = fileUtil;
        this.cashDonationRepository = cashDonationRepository;
    }

//    public Page<BoxDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<BoxDonation> boxDonations = boxDonationRepository.findAll(pageable);
//        List<BoxDonationReadDTO> data = boxDonations.getContent().stream()
//                .map(boxDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, boxDonations.getTotalElements());
//    }

    public List<BoxDonationReadDTO> findAll() {
        List<BoxDonation> boxDonations = boxDonationRepository.findAll();
        return boxDonations.stream()
                .map(boxDonationMapper::toDto)
                .toList();
    }

//    public BoxDonationReadDTO findById(UUID id) {
//        return boxDonationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi FO tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, BoxDonationCreateDTO dto) {
        BoxDonation boxDonation = boxDonationMapper.toBoxDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        boxDonation.setReceiptPhoto(filename);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        String receiptNumber = generateReceiptNumber(user);
        boxDonation.setReceiptNumber(receiptNumber);
        boxDonation.setUser(user);

        boxDonationRepository.save(boxDonation);
    }

    public void update(BoxDonationUpdateDTO dto, MultipartFile file) {
        BoxDonation boxDonation = boxDonationRepository.findById(dto.getId())
                .map(bd -> {
                    String oldFilename = bd.getReceiptPhoto();
                    dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setReceiptNumber(bd.getReceiptNumber());
                    dto.setCreatedAt(bd.getCreatedAt());
                    return boxDonationMapper.toBoxDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi FO tidak ditemukan, ID: " + dto.getId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        boxDonation.setUser(user);

        boxDonationRepository.save(boxDonation);
    }

    public void deleteById(UUID id) {
        BoxDonation boxDonation = boxDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Pundi FO tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(boxDonation.getReceiptPhoto(), SUB_FOLDER);
        boxDonationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public BoxDonationReadDTO mapper(BoxDonation boxDonation) {
//        UserReadDTO user = userMapper.toDto(boxDonation.getUser());
//        BoxDonationReadDTO boxDonationReadDTO = boxDonationMapper.toDto(boxDonation);
//        boxDonationReadDTO.setUser(user);
//        return boxDonationReadDTO;
//    }

//    METHOD UNTUK MEN-GENERATE NOMOR KUITANSI SECARA OTOMATIS
    public String generateReceiptNumber(User user) {
        CashDonation lastCashDonation = cashDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
//        BoxDonation lastBoxDonation = boxDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
        int lastCashNumber = lastCashDonation != null ? Integer.parseInt(lastCashDonation.getReceiptNumber().substring(user.getWorkArea().name().length() + 1)) : 0;
//        int lastBoxNumber = lastBoxDonation != null ? Integer.parseInt(lastBoxDonation.getReceiptNumber().substring(user.getWorkArea().name().length() + 1)) : 0;
//
//        List<Integer> lastNumbers = new ArrayList<>();
//        lastNumbers.add(lastCashNumber);
//        lastNumbers.add(lastBoxNumber);
//        lastNumbers.sort(Collections.reverseOrder());
//
//        int nextNumber = lastNumbers.get(0) + 1;

        int nextNumber = lastCashNumber + 1;
        String formatNumber = String.format("%09d", nextNumber);

        return user.getWorkArea() + "-" + formatNumber;
    }
}
