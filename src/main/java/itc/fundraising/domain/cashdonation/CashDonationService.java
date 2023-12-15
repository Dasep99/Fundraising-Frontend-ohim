package itc.fundraising.domain.cashdonation;

import itc.fundraising.domain.cashdonation.dto.CashDonationCreateDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationReadDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationUpdateDTO;
import itc.fundraising.domain.cashdonation.dto.ReceiptDTO;
import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.DonorRepository;
import itc.fundraising.domain.user.User;
import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.enums.DonationStatus;
import itc.fundraising.utils.FileUtil;
import itc.fundraising.utils.ResourceNotFoundException;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
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

    public CashDonationService(CashDonationRepository cashDonationRepository,
                               UserRepository userRepository, CashDonationMapper cashDonationMapper,
                               DonorRepository donorRepository, FileUtil fileUtil) {
        this.cashDonationRepository = cashDonationRepository;
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.cashDonationMapper = cashDonationMapper;
        this.fileUtil = fileUtil;
    }

//    public Page<CashDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CashDonation> cashDonations = cashDonationRepository.findAll(pageable);
//        List<CashDonationReadDTO> data = cashDonations.getContent().stream()
//                .map(cashDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, cashDonations.getTotalElements());
//    }

    public List<CashDonationReadDTO> findAll() {
        List<CashDonation> cashDonations = cashDonationRepository.findAllByOrderByDateDescUser_WorkAreaAscReceiptNumberAsc();
        return cashDonations.stream()
                .map(cashDonationMapper::toDto)
                .toList();
    }

    public List<CashDonation> findByDateMonthAndDateYear(short date_month, int date_year) {
        return cashDonationRepository.findByMonthAndYear(date_month, date_year);
    }

    public void create(MultipartFile file, CashDonationCreateDTO dto) {
        CashDonation cashDonation = cashDonationMapper.toCashDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        cashDonation.setReceiptPhoto(filename);

//        User user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
//        cashDonation.setUser(user);
//        String receiptNumber = generateReceiptNumber(user);
//        cashDonation.setReceiptNumber(receiptNumber);

        save(cashDonation, dto.getUserId(), dto.getDonorId());
    }

    public void update(CashDonationUpdateDTO  dto, MultipartFile file) {
        CashDonation cashDonation = cashDonationRepository.findById(dto.getId())
                .map(cd -> {
                    String oldFilename = cd.getReceiptPhoto();
                    if (file != null) {
                        dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    } else {
                        dto.setReceiptPhoto(oldFilename);
                    }
                    dto.setReceiptNumber(cd.getReceiptNumber());
                    dto.setCreatedAt(cd.getCreatedAt());
                    return cashDonationMapper.toCashDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + dto.getId()));

//        User user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
//        cashDonation.setUser(user);

        save(cashDonation, dto.getUserId(), dto.getDonorId());
    }

    public void deleteById(UUID id) {
        CashDonation cashDonation = cashDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(cashDonation.getReceiptPhoto(), SUB_FOLDER);
        cashDonationRepository.deleteById(id);
    }

    public void updateStatus(UUID id, String status) {
        CashDonation cashDonation = cashDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Cash tidak ditemukan, ID: " + id));
        cashDonation.setStatus(DonationStatus.valueOf(status));
        cashDonationRepository.save(cashDonation);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

    public byte[] getReceipt(ReceiptDTO receiptDTO) throws IOException, JRException {
        InputStream logo = new ClassPathResource("receipt-logo.png").getInputStream();
        InputStream jjg = new ClassPathResource("jajar-genjang.png").getInputStream();
        InputStream jjg2 = new ClassPathResource("jajar-genjang2.png").getInputStream();
        InputStream qr = new ClassPathResource("qr.jpg").getInputStream();

        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("receiptNumber", receiptDTO.getReceiptNumber());
        parameters.put("donorName", receiptDTO.getDonorName());
        parameters.put("amountLong", receiptDTO.getAmountLong());
        parameters.put("amountShort", receiptDTO.getAmountShort());
        parameters.put("date", receiptDTO.getDate());
        parameters.put("logo", logo);
        parameters.put("jjg", jjg);
        parameters.put("jjg2", jjg2);
        parameters.put("qr", qr);

        InputStream fileReport = new ClassPathResource("jasper-report/cash-donation-receipt.jasper").getInputStream();
        JasperPrint jasperPrint =  JasperFillManager.fillReport(fileReport, parameters, new JREmptyDataSource());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

//    MAPPING UNTUK MENAMPILKAN DATA
//    public CashDonationReadDTO mapper(CashDonation cashDonation) {
//        UserReadDTO user = userMapper.toDto(cashDonation.getUser());
//        DonorReadDTO donor = donorMapper.toDto(cashDonation.getDonor());
//        CashDonationReadDTO cashDonationReadDTO = cashDonationMapper.toDto(cashDonation);
//        cashDonationReadDTO.setUser(user);
//        cashDonationReadDTO.setDonor(donor);
//        return cashDonationReadDTO;
//    }

//    METHOD UNTUK MENYIMPAN DATA (INSERT DAN UPDATE)
    public void save(CashDonation cashDonation, UUID userId, UUID donorId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + donorId));
        cashDonation.setUser(user);
        cashDonation.setDonor(donor);
        cashDonationRepository.save(cashDonation);
    }

//    METHOD UNTUK MEN-GENERATE NOMOR KUITANSI SECARA OTOMATIS
    public String generateReceiptNumber(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        CashDonation lastCashDonation = cashDonationRepository.findFirstByUser_WorkAreaOrderByReceiptNumberDesc(user.getWorkArea());
        String formatNumber = "";
        String initial = "";

        if (user.getRole().name().equals("FRONT_OFFICE")) {
            initial = String.valueOf(user.getWorkArea());
            int lastCashNumber = lastCashDonation != null ? Integer.parseInt(lastCashDonation.getReceiptNumber().substring(initial.length() + 1)) : 0;

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
