package itc.fundraising.domain.visit;

import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.DonorRepository;
import itc.fundraising.domain.visit.dto.VisitCreateDTO;
import itc.fundraising.domain.visit.dto.VisitReadDTO;
import itc.fundraising.domain.visit.dto.VisitUpdateDTO;
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
public class VisitService {

    private static final String SUB_FOLDER = "visit";
    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final VisitMapper visitMapper;
    private final FileUtil fileUtil;
    private final DonorRepository donorRepository;

    public VisitService(VisitRepository visitRepository,
                        UserRepository userRepository,
                        VisitMapper visitMapper, FileUtil fileUtil,
                        DonorRepository donorRepository) {
        this.visitRepository = visitRepository;
        this.userRepository = userRepository;
        this.visitMapper = visitMapper;
        this.fileUtil = fileUtil;
        this.donorRepository = donorRepository;
    }

    public List<VisitReadDTO> findAll() {
        List<Visit> visits = visitRepository.findAllByOrderByDateDescUser_WorkAreaAsc();
        return visits.stream()
                .map(visitMapper::toDto)
                .toList();
    }

//    public VisitReadDTO findById(UUID id) {
//        return visitRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Kunjungan Tamu tidak ditemukan, ID: " + id));
//    }

    public void create(MultipartFile file, VisitCreateDTO dto) {
        Visit visit = visitMapper.toVisitCreate(dto);

        String filename = fileUtil.createFile(file, SUB_FOLDER);
        visit.setPhoto(filename);

        save(visit, dto.getUserId(), dto.getDonorId());
    }

    public void update(VisitUpdateDTO dto, MultipartFile file) {
        Visit visit = visitRepository.findById(dto.getId())
                .map(g -> {
                    String oldFilename = g.getPhoto();
                    if (file != null) {
                        dto.setPhoto(fileUtil.updateFile(file, oldFilename, SUB_FOLDER));
                    } else {
                        dto.setPhoto(oldFilename);
                    }
                    dto.setCreatedAt(g.getCreatedAt());
                    return visitMapper.toVisitUpdate(dto);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Data Kunjungan Tamu tidak ditemukan, ID: " + dto.getId()));

        save(visit, dto.getUserId(), dto.getDonorId());
    }

    public void deleteById(UUID id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Kunjungan Tamu tidak ditemukan, ID: " + id));
        fileUtil.deleteFile(visit.getPhoto(), SUB_FOLDER);
        visitRepository.deleteById(id);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(FileUtil.UPLOAD_DIR, SUB_FOLDER, filename);
        return Files.readAllBytes(imagePath);
    }

//    public VisitReadDTO mapper(Visit visit) {
//        UserReadDTO user = userMapper.toDto(visit.getUser());
//        VisitReadDTO visitReadDTO = visitMapper.toDto(visit);
//        visitReadDTO.setUser(user);
//        return visitReadDTO;
//    }

    public void save(Visit visit, UUID userId, UUID donorId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + donorId));
        visit.setUser(user);
        visit.setDonor(donor);
        visitRepository.save(visit);
    }
}
