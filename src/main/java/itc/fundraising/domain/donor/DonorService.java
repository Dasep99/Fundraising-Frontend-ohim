package itc.fundraising.domain.donor;

import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.domain.user.User;
import itc.fundraising.domain.user.UserRepository;
import itc.fundraising.utils.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DonorService {

    private final DonorRepository donorRepository;
    private final DonorMapper donorMapper;
    private final UserRepository userRepository;

    public DonorService(DonorRepository donorRepository, DonorMapper donorMapper,
                        UserRepository userRepository) {
        this.donorRepository = donorRepository;
        this.donorMapper = donorMapper;
        this.userRepository = userRepository;
    }

//    public Page<DonorReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<Donor> donors = donorRepository.findAll(pageable);
//        List<DonorReadDTO> data = donors.getContent().stream()
//                .map(donorMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, donors.getTotalElements());
//    }

    public List<DonorReadDTO> findAll() {
        List<Donor> donors = donorRepository.findAll();
        return donors.stream()
                .map(donorMapper::toDto)
                .toList();
    }

//    public DonorReadDTO findById(UUID id) {
//        return donorRepository.findById(id)
//                .map(this::mapper)
//                .orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + id));
//    }

    public void create(DonorCreateDTO dto) {
        Donor donor = donorMapper.toDonorCreate(dto);
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        donor.setUser(user);
        donorRepository.save(donor);
    }

    public void update(DonorUpdateDTO dto) {
        Donor donor = donorRepository.findById(dto.getId())
                .map(d -> {
                    dto.setCreatedAt(d.getCreatedAt());
                    return donorMapper.toDonorUpdate(dto);
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + dto.getId()));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + dto.getUserId()));
        donor.setUser(user);
        donorRepository.save(donor);
    }

    public void deleteById(UUID id) {
        donorRepository.findById(id)
                .map(d -> {
                    donorRepository.deleteById(id);
                    return d;
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + id));
    }

//    public DonorReadDTO mapper(Donor donor) {
//        UserReadDTO user = userMapper.toDto(donor.getUser());
//        DonorReadDTO donorReadDTO = donorMapper.toDto(donor);
//        donorReadDTO.setUser(user);
//        return donorReadDTO;
//    }

}
