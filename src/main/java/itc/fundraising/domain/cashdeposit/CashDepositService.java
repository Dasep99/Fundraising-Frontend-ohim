package itc.fundraising.domain.cashdeposit;

import itc.fundraising.domain.cashdeposit.dto.CashDepositCreateDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositReadDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositUpdateDTO;
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
public class CashDepositService {

    private static final String SUB_FOLDER = "cash-deposit";
    private final CashDepositRepository cashDepositRepository;
    private final UserRepository userRepository;
    private final CashDepositMapper cashDepositMapper;
    private final FileUtil fileUtil;

    public CashDepositService(
            CashDepositRepository cashDepositRepository,
            UserRepository userRepository,
            CashDepositMapper cashDepositMapper, FileUtil fileUtil) {
        this.cashDepositRepository = cashDepositRepository;
        this.userRepository = userRepository;
        this.cashDepositMapper = cashDepositMapper;
        this.fileUtil = fileUtil;
    }

//    public Page<CashDepositReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<CashDeposit> cashDeposits = cashDepositRepository.findAll(pageable);
//        List<CashDepositReadDTO> data = cashDeposits.getContent().stream()
//                .map(cashDepositMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, cashDeposits.getTotalElements());
//    }

    public List<CashDepositReadDTO> findAll() {
        List<CashDeposit> cashDeposits = cashDepositRepository.findAll();
        return cashDeposits.stream()
                .map(cashDepositMapper::toDto)
                .toList();
    }

//    public CashDepositReadDTO findById(UUID id) {
//        return cashDepositRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Setor Tunai tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, CashDepositCreateDTO dto) {
        CashDeposit cashDeposit = cashDepositMapper.toCashDepositCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        cashDeposit.setReceiptPhoto(filename);

        save(cashDeposit, dto.getUserId());
    }

    public void update(CashDepositUpdateDTO dto, MultipartFile file) {
        CashDeposit cashDeposit = cashDepositRepository.findById(dto.getId())
                .map(cd -> {
                    String oldFilename = cd.getReceiptPhoto();
                    dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    dto.setCreatedAt(cd.getCreatedAt());
                    return cashDepositMapper.toCashDepositUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Setor Tunai tidak ditemukan, ID: " + dto.getId()));

        save(cashDeposit, dto.getUserId());
    }

    public void deleteById(UUID id) {
        CashDeposit cashDeposit = cashDepositRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Setor Tunai tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(cashDeposit.getReceiptPhoto(), SUB_FOLDER);
        cashDepositRepository.deleteById(id);
    }

    public static byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public CashDepositReadDTO mapper(CashDeposit cashDeposit) {
//        UserReadDTO user = userMapper.toDto(cashDeposit.getUser());
//        CashDepositReadDTO cashDepositReadDTO = cashDepositMapper.toDto(cashDeposit);
//        cashDepositReadDTO.setUser(user);
//        return cashDepositReadDTO;
//    }

    public void save(CashDeposit cashDeposit, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        cashDeposit.setUser(user);
        cashDepositRepository.save(cashDeposit);
    }
}
