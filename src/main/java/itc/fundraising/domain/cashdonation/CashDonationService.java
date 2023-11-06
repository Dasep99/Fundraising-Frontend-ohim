package itc.fundraising.domain.cashdonation;

import itc.fundraising.domain.boxdonation.BoxDonationRepository;
import itc.fundraising.domain.cashdonation.dto.CashDonationCreateDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationReadDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationUpdateDTO;
import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.DonorRepository;
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
public class CashDonationService {

    private static final String SUB_FOLDER = "cash-donation";
    private final CashDonationRepository cashDonationRepository;
    private final UserRepository userRepository;
    private final CashDonationMapper cashDonationMapper;
    private final DonorRepository donorRepository;
    private final FileUtil fileUtil;
    private final BoxDonationRepository boxDonationRepository;

    public CashDonationService(CashDonationRepository cashDonationRepository,
                               UserRepository userRepository, CashDonationMapper cashDonationMapper,
                               DonorRepository donorRepository, FileUtil fileUtil, BoxDonationRepository boxDonationRepository) {
        this.cashDonationRepository = cashDonationRepository;
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.cashDonationMapper = cashDonationMapper;
        this.fileUtil = fileUtil;
        this.boxDonationRepository = boxDonationRepository;
    }

//    public Page<CashDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CashDonation> cashDonations = cashDonationRepository.findAll(pageable);
//        List<CashDonationReadDTO> data = cashDonations.getContent().stream()
//                .map(cashDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, cashDonations.getTotalElements());
//    }

    public List<CashDonationReadDTO> findAll() {
        List<CashDonation> cashDonations = cashDonationRepository.findAll();
        return cashDonations.stream()
                .map(cashDonationMapper::toDto)
                .toList();
    }

//    public CashDonationReadDTO findById(UUID id) {
//        return cashDonationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + id));
//    }

    public List<CashDonation> findByDonorId(UUID donorId) {
        return cashDonationRepository.findByDonorId(donorId);
    }



    public void create(MultipartFile file, CashDonationCreateDTO dto) {
        CashDonation cashDonation = cashDonationMapper.toCashDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        cashDonation.setReceiptPhoto(filename);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        String receiptNumber = generateReceiptNumber(user);
        cashDonation.setReceiptNumber(receiptNumber);
        cashDonation.setUser(user);
        
        save(cashDonation, dto.getDonorId());
    }

    public void update(CashDonationUpdateDTO  dto, MultipartFile file) {
        CashDonation cashDonation = cashDonationRepository.findById(dto.getId())
                .map(cd -> {
                    String oldFilename = cd.getReceiptPhoto();
                    dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setReceiptNumber(cd.getReceiptNumber());
                    dto.setCreatedAt(cd.getCreatedAt());
                    return cashDonationMapper.toCashDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + dto.getId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        cashDonation.setUser(user);

        save(cashDonation, dto.getDonorId());
    }

    public void deleteById(UUID id) {
        CashDonation cashDonation = cashDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(cashDonation.getReceiptPhoto(), SUB_FOLDER);
        cashDonationRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }



//    METHOD UNTUK MENYIMPAN DATA (INSERT DAN UPDATE)
    public void save(CashDonation cashDonation, UUID donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + donorId));
        cashDonation.setDonor(donor);
        cashDonationRepository.save(cashDonation);
    }

//    METHOD UNTUK MEN-GENERATE NOMOR KUITANSI SECARA OTOMATIS
    public String generateReceiptNumber(User user) {
        CashDonation lastCashDonation = cashDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
//        BoxDonation lastBoxDonation = boxDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
        String formatNumber = "";
        String initial = "";

        if (user.getRole().name().equals("FRONT_OFFICE")) {
            initial = String.valueOf(user.getWorkArea());
            int lastCashNumber = lastCashDonation != null ? Integer.parseInt(lastCashDonation.getReceiptNumber().substring(initial.length() + 1)) : 0;
//            int lastBoxNumber = lastBoxDonation != null ? Integer.parseInt(lastBoxDonation.getReceiptNumber().substring(initial.length() + 1)) : 0;
//
//            List<Integer> lastNumbers = new ArrayList<>();
//            lastNumbers.add(lastCashNumber);
//            lastNumbers.add(lastBoxNumber);
//            lastNumbers.sort(Collections.reverseOrder());
//
//            int nextNumber = lastNumbers.get(0) + 1;

            int nextNumber = lastCashNumber + 1;
            formatNumber = String.format("%09d", nextNumber);
        }

        if (user.getRole().name().equals("TIM_JEMPUT_DONASI")) {
            initial = switch (user.getWorkArea().name()) {
                case "CIREBON" -> "DC";
                case "BEKASI" -> "DB";
                case "JAKARTA" -> "DJ";
                case "KUNINGAN" -> "DK";
                case "MAJALENGKA" -> "DM";
                case "KALIMANTAN" -> "DKL";
                case "SURABAYA" -> "DS";
                default -> initial;
            };

            int lastNumber = lastCashDonation != null ? Integer.parseInt(lastCashDonation.getReceiptNumber().substring(initial.length() + 1)) : 0;
            int nextNumber = lastNumber + 1;
            formatNumber = String.format("%08d", nextNumber);
        }

        return initial + "-" + formatNumber;
    }

}
