package itc.fundraising.domain.region;

import itc.fundraising.domain.region.district.District;
import itc.fundraising.domain.region.district.DistrictRepository;
import itc.fundraising.domain.region.province.Province;
import itc.fundraising.domain.region.province.ProvinceRepository;
import itc.fundraising.domain.region.regency.Regency;
import itc.fundraising.domain.region.regency.RegencyRepository;
import itc.fundraising.domain.region.village.Village;
import itc.fundraising.domain.region.village.VillageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RegionService {


    private final ProvinceRepository provinceRepository;
    private final RegencyRepository regencyRepository;
    private final DistrictRepository districtRepository;
    private final VillageRepository villageRepository;

    public RegionService(ProvinceRepository provinceRepository, RegencyRepository regencyRepository, DistrictRepository districtRepository, VillageRepository villageRepository) {
        this.provinceRepository = provinceRepository;
        this.regencyRepository = regencyRepository;
        this.districtRepository = districtRepository;
        this.villageRepository = villageRepository;
    }

    public List<Province> findAllProvinces() {
        return provinceRepository.findAll();
    }

    public List<RegionReadDTO> findRegenciesByProvinceId(String provinceId) {
        List<Regency> regencies = regencyRepository.findByProvinceId(provinceId);
        return regencies.stream()
                .map(regency -> {
                    RegionReadDTO dto = new RegionReadDTO();
                    dto.setId(regency.getId());
                    dto.setName(regency.getName());
                    return dto;
                })
                .toList();
    }

    public List<RegionReadDTO> findDistrictsByRegencyId(String regencyId) {
        List<District> districts = districtRepository.findByRegencyId(regencyId);
        return districts.stream()
                .map(district -> {
                    RegionReadDTO dto = new RegionReadDTO();
                    dto.setId(district.getId());
                    dto.setName(district.getName());
                    return dto;
                })
                .toList();
    }

    public List<RegionReadDTO> findVillagesByDistrictId(String districtId) {
        List<Village> villages = villageRepository.findByDistrictId(districtId);
        return villages.stream()
                .map(village -> {
                    RegionReadDTO dto = new RegionReadDTO();
                    dto.setId(village.getId());
                    dto.setName(village.getName());
                    return dto;
                })
                .toList();
    }

}
