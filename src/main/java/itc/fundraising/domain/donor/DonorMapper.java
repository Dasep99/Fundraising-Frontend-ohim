package itc.fundraising.domain.donor;

import itc.fundraising.domain.donor.dto.DonorCreateDTO;
import itc.fundraising.domain.donor.dto.DonorReadDTO;
import itc.fundraising.domain.donor.dto.DonorUpdateDTO;
import itc.fundraising.domain.region.RegionMapper;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DonorType;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DonorMapper {

    private final UserMapper userMapper;
    private final RegionMapper regionMapper;

    public DonorMapper(UserMapper userMapper, RegionMapper regionMapper) {
        this.userMapper = userMapper;
        this.regionMapper = regionMapper;
    }

    public Donor toDonorCreate(DonorCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Donor donor = new Donor();

        if (dto.getNik() != null && !dto.getNik().isBlank()) {
            donor.setDonorId(dto.getNik());
        } else if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
            donor.setDonorId(dto.getPhoneNumber());
        }
        if (dto.getNik() != null && dto.getNik().isBlank()) {
            dto.setNik(null);
        }
        donor.setNik(dto.getNik());
        donor.setName(dto.getName().trim());
        donor.setGender(dto.getGender());
        donor.setBirthDate(dto.getBirthDate());
        if (dto.getPhoneNumber() != null && dto.getPhoneNumber().isBlank()) {
            dto.setPhoneNumber(null);
        }
        donor.setPhoneNumber(dto.getPhoneNumber());
        donor.setStreet(dto.getStreet());
        if (dto.getEmail() != null && dto.getEmail().isBlank()) {
            dto.setEmail(null);
        }
        donor.setEmail(dto.getEmail());
        donor.setJob(dto.getJob());
        if (dto.getType() != null) {
            donor.setType(DonorType.valueOf(dto.getType().trim()));
        }
        donor.setOtherInfo(dto.getOtherInfo());

        return donor;
    }

    public Donor toDonorUpdate(DonorUpdateDTO dto) {
        if (dto == null) {
            return null;
        }

        Donor donor = new Donor();

        donor.setCreatedAt(dto.getCreatedAt());
        donor.setId(dto.getId());
        if (dto.getNik() != null && !dto.getNik().isBlank()) {
            donor.setDonorId(dto.getNik());
        } else if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
            donor.setDonorId(dto.getPhoneNumber());
        }
        if (dto.getNik() != null && dto.getNik().isBlank()) {
            dto.setNik(null);
        }
        donor.setNik(dto.getNik());
        donor.setName(dto.getName().trim());
        donor.setGender(dto.getGender());
        donor.setBirthDate(dto.getBirthDate());
        if (dto.getPhoneNumber() != null && dto.getPhoneNumber().isBlank()) {
            dto.setPhoneNumber(null);
        }
        donor.setPhoneNumber(dto.getPhoneNumber());
        donor.setStreet(dto.getStreet());
        if (dto.getEmail() != null && dto.getEmail().isBlank()) {
            dto.setEmail(null);
        }
        donor.setEmail(dto.getEmail());
        donor.setJob(dto.getJob());
        if (dto.getType() != null) {
            donor.setType(DonorType.valueOf(dto.getType().trim()));
        }
        donor.setOtherInfo(dto.getOtherInfo());

        return donor;
    }

    public DonorReadDTO toDto(Donor donor) {
        if (donor == null) {
            return null;
        }

        DonorReadDTO donorReadDTO = new DonorReadDTO();

        donorReadDTO.setId(donor.getId());
        donorReadDTO.setDonorId(donor.getDonorId());
        donorReadDTO.setNik(donor.getNik());
        donorReadDTO.setName(donor.getName());
        donorReadDTO.setGender(donor.getGender());
        donorReadDTO.setBirthDate(donor.getBirthDate());
        donorReadDTO.setPhoneNumber(donor.getPhoneNumber());
        donorReadDTO.setStreet(donor.getStreet());
        donorReadDTO.setProvince(regionMapper.toProvinceDto(donor.getProvince()));
        donorReadDTO.setRegency(regionMapper.toRegencyDto(donor.getRegency()));
        donorReadDTO.setDistrict(regionMapper.toDistrictDto(donor.getDistrict()));
        donorReadDTO.setVillage(regionMapper.toVillageDto(donor.getVillage()));
        donorReadDTO.setEmail(donor.getEmail());
        donorReadDTO.setJob(donor.getJob());
        donorReadDTO.setType(donor.getType());
        donorReadDTO.setOtherInfo(donor.getOtherInfo());
        if (donor.getBirthDate() != null) {
            donorReadDTO.setAgeSegmentation(toAgeSegmentation(donor.getBirthDate()));
        }
        donorReadDTO.setUser(userMapper.toDto(donor.getUser()));

        return donorReadDTO;
    }

    private String toAgeSegmentation(LocalDate birthDate) {
        int birthYear = birthDate.getYear();

        if (birthYear <= 1964) {
            return "Baby Boomers";
        } else if (birthYear <= 1976) {
            return "Gen X";
        } else if (birthYear <= 1994) {
            return "Gen Y";
        } else if (birthYear <= 2010) {
            return "Gen Z";
        } else {
            return "Gen Alpha";
        }
    }

}
