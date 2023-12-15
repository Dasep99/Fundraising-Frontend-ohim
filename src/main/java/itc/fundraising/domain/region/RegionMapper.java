package itc.fundraising.domain.region;

import itc.fundraising.domain.region.district.District;
import itc.fundraising.domain.region.province.Province;
import itc.fundraising.domain.region.regency.Regency;
import itc.fundraising.domain.region.village.Village;
import org.springframework.stereotype.Component;

@Component
public class RegionMapper {

    public RegionReadDTO toProvinceDto(Province province) {
        if (province == null) {
            return null;
        }

        RegionReadDTO regionReadDTO = new RegionReadDTO();
        regionReadDTO.setId(province.getId());
        regionReadDTO.setName(province.getName());
        return regionReadDTO;
    }

    public RegionReadDTO toRegencyDto(Regency regency) {
        if (regency == null) {
            return null;
        }

        RegionReadDTO regionReadDTO = new RegionReadDTO();
        regionReadDTO.setId(regency.getId());
        regionReadDTO.setName(regency.getName());
        return regionReadDTO;
    }

    public RegionReadDTO toDistrictDto(District district) {
        if (district == null) {
            return null;
        }

        RegionReadDTO regionReadDTO = new RegionReadDTO();
        regionReadDTO.setId(district.getId());
        regionReadDTO.setName(district.getName());
        return regionReadDTO;
    }

    public RegionReadDTO toVillageDto(Village village) {
        if (village == null) {
            return null;
        }

        RegionReadDTO regionReadDTO = new RegionReadDTO();
        regionReadDTO.setId(village.getId());
        regionReadDTO.setName(village.getName());
        return regionReadDTO;
    }

}
