package itc.fundraising.domain.transferdonation;

import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.DonorRepository;
import itc.fundraising.domain.transferdonation.dto.TransferDonationCreateDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationReadDTO;
import itc.fundraising.domain.transferdonation.dto.TransferDonationUpdateDTO;
import itc.fundraising.domain.user.User;
import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.enums.DonationStatus;
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
public class TransferDonationService {

    private static final String SUB_FOLDER = "transfer-donation";
    private final TransferDonationRepository transferDonationRepository;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final TransferDonationMapper transferDonationMapper;
    private final FileUtil fileUtil;

    public TransferDonationService(TransferDonationRepository transferDonationRepository,
                                   UserRepository userRepository,
                                   DonorRepository donorRepository, TransferDonationMapper transferDonationMapper, FileUtil fileUtil) {
        this.transferDonationRepository = transferDonationRepository;
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.transferDonationMapper = transferDonationMapper;
        this.fileUtil = fileUtil;
    }

//    public Page<TransferDonationReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<TransferDonation> transferDonations = transferDonationRepository.findAll(pageable);
//        List<TransferDonationReadDTO> data = transferDonations.getContent().stream()
//                .map(transferDonationMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, transferDonations.getTotalElements());
//    }

    public List<TransferDonationReadDTO> findAll() {
        List<TransferDonation> transferDonations = transferDonationRepository.findAllByOrderByDateDescUser_WorkAreaAsc();
        return transferDonations.stream()
                .map(transferDonationMapper::toDto)
                .toList();
    }

//    public TransferDonationReadDTO findById(UUID id) {
//        return transferDonationRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Transfer tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, TransferDonationCreateDTO dto) {
        TransferDonation transferDonation = transferDonationMapper.toTransferDonationCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        transferDonation.setReceiptPhoto(filename);

        save(transferDonation, dto.getUserId(), dto.getDonorId());
    }

    public void update(TransferDonationUpdateDTO  dto, MultipartFile file) {
        TransferDonation transferDonation = transferDonationRepository.findById(dto.getId())
                .map(td -> {
                    String oldFilename = td.getReceiptPhoto();
                    if (file != null) {
                        dto.setReceiptPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    } else {
                        dto.setReceiptPhoto(oldFilename);
                    }
                    dto.setCreatedAt(td.getCreatedAt());
                    return transferDonationMapper.toTransferDonationUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Transfer tidak ditemukan, ID: " + dto.getId()));

        save(transferDonation, dto.getUserId(), dto.getDonorId());
    }

    public void deleteById(UUID id) {
        TransferDonation transferDonation = transferDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Transfer tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(transferDonation.getReceiptPhoto(), SUB_FOLDER);
        transferDonationRepository.deleteById(id);
    }

    public void updateStatus(UUID id, String status) {
        TransferDonation transferDonation = transferDonationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donasi Transfer tidak ditemukan, ID: " + id));
        transferDonation.setStatus(DonationStatus.valueOf(status));
        transferDonationRepository.save(transferDonation);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public TransferDonationReadDTO mapper(TransferDonation transferDonation) {
//        UserReadDTO user = userMapper.toDto(transferDonation.getUser());
//        DonorReadDTO donor = donorMapper.toDto(transferDonation.getDonor());
//        TransferDonationReadDTO transferDonationReadDTO = transferDonationMapper.toDto(transferDonation);
//        transferDonationReadDTO.setUser(user);
//        transferDonationReadDTO.setDonor(donor);
//        return transferDonationReadDTO;
//    }

    public void save(TransferDonation transferDonation, UUID userId, UUID donorId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + donorId));
        transferDonation.setUser(user);
        transferDonation.setDonor(donor);
        transferDonationRepository.save(transferDonation);
    }

}
