package itc.fundraising.domain.cashlessexpense;

import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseCreateDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseReadDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseUpdateDTO;
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
public class CashlessExpenseService {

    private static final String SUB_FOLDER = "cashless-expense";
    private final CashlessExpenseRepository cashlessExpenseRepository;
    private final UserRepository userRepository;
    private final CashlessExpenseMapper cashlessExpenseMapper;
    private final FileUtil fileUtil;

    public CashlessExpenseService(
            CashlessExpenseRepository cashlessExpenseRepository,
            UserRepository userRepository,
            CashlessExpenseMapper cashlessExpenseMapper, FileUtil fileUtil) {
        this.cashlessExpenseRepository = cashlessExpenseRepository;
        this.userRepository = userRepository;
        this.cashlessExpenseMapper = cashlessExpenseMapper;
        this.fileUtil = fileUtil;
    }

//    public Page<CashlessExpenseReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CashlessExpense> cashlessExpenses = cashlessExpenseRepository.findAll(pageable);
//        List<CashlessExpenseReadDTO> data = cashlessExpense.getContent().stream()
//                .map(cashlessExpenseMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, cashlessExpense.getTotalElements());
//    }

    public List<CashlessExpenseReadDTO> findAll() {
        List<CashlessExpense> cashlessExpens = cashlessExpenseRepository.findAll();
        return cashlessExpens.stream()
                .map(cashlessExpenseMapper::toDto)
                .toList();
    }

//    public CashlessExpenseReadDTO findById(UUID id) {
//        return cashlessExpenseRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Pengeluaran Non Tunai tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, CashlessExpenseCreateDTO dto) {
        CashlessExpense cashlessExpense = cashlessExpenseMapper.toCashlessExpenseCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        cashlessExpense.setBbkPhoto(filename);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        String bbkNumber = generateReceiptNumber(user);
        cashlessExpense.setBbkNumber(bbkNumber);
        cashlessExpense.setUser(user);

        cashlessExpenseRepository.save(cashlessExpense);
    }

    public void update(CashlessExpenseUpdateDTO dto, MultipartFile file) {
        CashlessExpense cashlessExpense = cashlessExpenseRepository.findById(dto.getId())
                .map(ce -> {
                    String oldFilename = ce.getBbkPhoto();
                    dto.setBbkPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setBbkNumber(ce.getBbkNumber());
                    dto.setCreatedAt(ce.getCreatedAt());
                    return cashlessExpenseMapper.toCashlessExpenseUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Pengeluaran Non Tunai tidak ditemukan, ID: " + dto.getId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        cashlessExpense.setUser(user);

        cashlessExpenseRepository.save(cashlessExpense);
    }

    public void deleteById(UUID id) {
        CashlessExpense cashlessExpense = cashlessExpenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Pengeluaran Non Tunai tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(cashlessExpense.getBbkPhoto(), SUB_FOLDER);
        cashlessExpenseRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public CashlessExpenseReadDTO mapper(CashlessExpense cashlessExpense) {
//        UserReadDTO user = userMapper.toDto(cashlessExpense.getUser());
//        CashlessExpenseReadDTO cashlessExpenseReadDTO = cashlessExpenseMapper.toDto(cashlessExpense);
//        cashlessExpenseReadDTO.setUser(user);
//        return cashlessExpenseReadDTO;
//    }

//    METHOD UNTUK MEN-GENERATE NOMOR KUITANSI SECARA OTOMATIS
    public String generateReceiptNumber(User user) {
        CashlessExpense lastExpense = cashlessExpenseRepository.findFirstByUser_WorkAreaOrderByBbkNumberDesc(user.getWorkArea());
        String initial = "GNT" + String.format("%02d", user.getWorkArea().ordinal() - 1);
        int lastNumber = lastExpense != null ? Integer.parseInt(lastExpense.getBbkNumber().substring(initial.length() + 1)) : 0;
        int nextNumber = lastNumber + 1;
        String formatNumber = String.format("%05d", nextNumber);

        return initial + "-" + formatNumber;
    }
}
