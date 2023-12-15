package itc.fundraising.domain.target;

import itc.fundraising.domain.dailyvalidation.DailyValidation;
import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.domain.target.dto.TargetCreateDTO;
import itc.fundraising.domain.target.dto.TargetReadDTO;
import itc.fundraising.domain.target.dto.TargetUpdateDTO;
import itc.fundraising.domain.user.User;
import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.utils.FileUtil;
import itc.fundraising.utils.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TargetService {

    private final TargetRepository targetRepository;

    private final UserRepository userRepository;
    private final TargetMapper targetMapper;
    private final FileUtil fileUtil;

    public TargetService(TargetRepository targetRepository, UserRepository userRepository, TargetMapper targetMapper, FileUtil fileUtil){

        this.targetRepository = targetRepository;
        this.userRepository = userRepository;
        this.targetMapper = targetMapper;
        this.fileUtil = fileUtil;
    }

    public List<TargetReadDTO> findAll() {
        List<Target> targets = targetRepository.findAll();
        return targets.stream()
                .map(targetMapper::toDto)
                .toList();
    }

    public void create(TargetCreateDTO dto) {
        Target target = targetMapper.toTargetCreate(dto);
        targetRepository.save(target);
    }

    public void update(TargetUpdateDTO dto) {
        Target target = targetRepository.findById(dto.getId())
                .map(d -> {
                    dto.setCreatedAt(d.getCreatedAt());
                    return targetMapper.toTargetUpdate(dto);
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + dto.getId()));
        targetRepository.save(target);
    }

    public void deleteById(UUID id) {
        Target target = targetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Target tidak ditemukan, ID: " + id));
        targetRepository.delete(target);
    }




}
