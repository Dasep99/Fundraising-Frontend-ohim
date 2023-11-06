package itc.fundraising.domain.cashlessdonation;

import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationCreateDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationReadDTO;
import itc.fundraising.domain.cashlessdonation.dto.CashlessDonationUpdateDTO;
import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.DonorRepository;
import itc.fundraising.domain.transferdonation.TransferDonation;
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
public class CashlessDonationService {

    private static final String SUB_FOLDER = "cashless-donation";
    private final CashlessDonationRepository cashlessDonationRepository;
    private final UserRepository userRepository;
    private final CashlessDonationMapper cashlessDonationMapper;
    private final DonorRepository donorRepository;
    private final FileUtil fileUtil;

    public CashlessDonationService(
            CashlessDonationRepository cashlessDonationRepository,
            UserRepository userRepository,
            CashlessDonationMapper cashlessDonationMapper,
            DonorRepository donorRepository, FileUtil fileUtil) {
        this.cashlessDonationRepository = cashlessDonationRepository;
        this.userRepository = userRepository;
        this.cashlessDonationMapper = cashlessDonationMapper;
        this.donorRepository = donorRepository;
        this.fileUtil = fileUtil;
    }

//    public Page<CashlessDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CashlessDonation> cashlessDonations = cashlessDonationRepository.findAll(pageable);
//        List<CashlessDonationReadDTO> data = cashlessDonations.getContent().stream()
//                .map(cashlessDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, cashlessDonations.getTotalElements());
//    }

    public List<CashlessDonationReadDTO> findAll() {
        List<CashlessDonation> cashDonations = cashlessDonationRepository.findAll();
        return cashDonations.stream()
                .map(cashlessDonationMapper::toDto)
                .toList();
    }

    public List<CashlessDonation> findByDonorId(UUID donorId) {
        return cashlessDonationRepository.findByDonorId(donorId);
    }

//    public CashlessDonationReadDTO findById(UUID id) {
//        return cashlessDonationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Non Tunai tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, CashlessDonationCreateDTO dto) {
        CashlessDonation cashlessDonation = cashlessDonationMapper.toCashlessDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        cashlessDonation.setReceiptPhoto(filename);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        String receiptNumber = generateReceiptNumber(user);
        cashlessDonation.setReceiptNumber(receiptNumber);
        cashlessDonation.setUser(user);

        save(cashlessDonation, dto.getDonorId());
    }

    public void update(CashlessDonationUpdateDTO dto, MultipartFile file) {
        CashlessDonation cashlessDonation = cashlessDonationRepository.findById(dto.getId())
                .map(cd -> {
                    String oldFilename = cd.getReceiptPhoto();
                    dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setReceiptNumber(cd.getReceiptNumber());
                    dto.setCreatedAt(cd.getCreatedAt());
                    return cashlessDonationMapper.toCashlessDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Non Tunai tidak ditemukan, ID: " + dto.getId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        cashlessDonation.setUser(user);

        save(cashlessDonation, dto.getDonorId());
    }

    public void deleteById(UUID id) {
        CashlessDonation cashlessDonation = cashlessDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Non Tunai tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(cashlessDonation.getReceiptPhoto(), SUB_FOLDER);
        cashlessDonationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public CashlessDonationReadDTO mapper(CashlessDonation cashlessDonation) {
//        UserReadDTO user = userMapper.toDto(cashlessDonation.getUser());
//        DonorReadDTO donor = donorMapper.toDto(cashlessDonation.getDonor());
//        CashlessDonationReadDTO cashlessDonationReadDTO = cashlessDonationMapper.toDto(cashlessDonation);
//        cashlessDonationReadDTO.setUser(user);
//        cashlessDonationReadDTO.setDonor(donor);
//        return cashlessDonationReadDTO;
//    }

//    METHOD UNTUK MENYIMPAN DATA (INSERT DAN UPDATE)
    public void save(CashlessDonation cashlessDonation, UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + donorId));
        cashlessDonation.setDonor(donor);
        cashlessDonationRepository.save(cashlessDonation);
    }

//    METHOD UNTUK MEN-GENERATE NOMOR KUITANSI SECARA OTOMATIS
    public String generateReceiptNumber(User user) {
        CashlessDonation lastDonation = cashlessDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
        String initial = "GNT" + String.format("%02d", user.getWorkArea().ordinal() - 1);
        int lastNumber = lastDonation != null ? Integer.parseInt(lastDonation.getReceiptNumber().substring(initial.length() + 1)) : 0;
        int nextNumber = lastNumber + 1;
        String formatNumber = String.format("%05d", nextNumber);

        return initial + "-" + formatNumber;
    }
}
