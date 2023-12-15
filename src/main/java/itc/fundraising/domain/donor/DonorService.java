package itc.fundraising.domain.donor;

import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.domain.region.district.District;
import itc.fundraising.domain.region.district.DistrictRepository;
import itc.fundraising.domain.region.province.Province;
import itc.fundraising.domain.region.province.ProvinceRepository;
import itc.fundraising.domain.region.regency.Regency;
import itc.fundraising.domain.region.regency.RegencyRepository;
import itc.fundraising.domain.region.village.Village;
import itc.fundraising.domain.region.village.VillageRepository;
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
    private final ProvinceRepository provinceRepository;
    private final RegencyRepository regencyRepository;
    private final DistrictRepository districtRepository;
    private final VillageRepository villageRepository;

    public DonorService(DonorRepository donorRepository, DonorMapper donorMapper,
                        UserRepository userRepository, ProvinceRepository provinceRepository, RegencyRepository regencyRepository, DistrictRepository districtRepository, VillageRepository villageRepository) {
        this.donorRepository = donorRepository;
        this.donorMapper = donorMapper;
        this.userRepository = userRepository;
        this.provinceRepository = provinceRepository;
        this.regencyRepository = regencyRepository;
        this.districtRepository = districtRepository;
        this.villageRepository = villageRepository;
    }

//    public Page<DonorReadDTO> findAll(PaginationRequestDTO pagination) {
//        Pageable pageable = PageRequest.of(pagination.getPage(), pagination.getSize());
//        Page<Donor> donors = donorRepository.findAll(pageable);
//        List<DonorReadDTO> data = donors.getContent().stream()
//                .map(donorMapper::toDto).toList();
//        return new PageImpl<>(data, pageable, donors.getTotalElements());
//    }

    public List<DonorReadDTO> findAll() {
        List<Donor> donors = donorRepository.findAllByOrderByName();
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
        save(donor, dto.getUserId(), dto.getProvinceId(), dto.getRegencyId(), dto.getDistrictId(), dto.getVillageId());
    }

    public void update(DonorUpdateDTO dto) {
        Donor donor = donorRepository.findById(dto.getId())
                .map(d -> {
                    dto.setCreatedAt(d.getCreatedAt());
                    return donorMapper.toDonorUpdate(dto);
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + dto.getId()));
        save(donor, dto.getUserId(), dto.getProvinceId(), dto.getRegencyId(), dto.getDistrictId(), dto.getVillageId());
    }

    public void deleteById(UUID id) {
        donorRepository.findById(id)
                .map(d -> {
                    donorRepository.deleteById(id);
                    return d;
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + id));
    }

    public void save(Donor donor, UUID userId, String provinceId, String regencyId, String districtId, String villageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Data User tidak ditemukan, ID: " + userId));
        donor.setUser(user);

        if (provinceId != null && !provinceId.isBlank()) {
            Province province = provinceRepository.findById(provinceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data Provinsi tidak ditemukan, ID: " + provinceId));
            donor.setProvince(province);
        }

        if (regencyId != null && !regencyId.isBlank()) {
            Regency regency = regencyRepository.findById(regencyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data Kabupaten/Kota tidak ditemukan, ID: " + regencyId));
            donor.setRegency(regency);
        }

        if (districtId != null && !districtId.isBlank()) {
            District district = districtRepository.findById(districtId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data Kecamatan tidak ditemukan, ID: " + districtId));
            donor.setDistrict(district);
        }

        if (villageId != null && !villageId.isBlank()) {
            Village village = villageRepository.findById(villageId)
                    .orElseThrow(() -> new ResourceNotFoundException("Data Desa/Kelurahan tidak ditemukan, ID: " + villageId));
            donor.setVillage(village);
        }

        donorRepository.save(donor);
    }

//    public DonorReadDTO mapper(Donor donor) {
//        UserReadDTO user = userMapper.toDto(donor.getUser());
//        DonorReadDTO donorReadDTO = donorMapper.toDto(donor);
//        donorReadDTO.setUser(user);
//        return donorReadDTO;
//    }

}
