package itc.fundraising.domain.visit;

import itc.fundraising.domain.donor.DonorMapper;
import itc.fundraising.domain.visit.dto.VisitCreateDTO;
import itc.fundraising.domain.visit.dto.VisitReadDTO;
import itc.fundraising.domain.visit.dto.VisitUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class VisitMapper {

    private final UserMapper userMapper;
    private final DonorMapper donorMapper;

    public VisitMapper(UserMapper userMapper, DonorMapper donorMapper) {
        this.userMapper = userMapper;
        this.donorMapper = donorMapper;
    }

    public Visit toVisitCreate(VisitCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Visit visit = new Visit();

        visit.setDate(dto.getDate());
        visit.setPurpose(dto.getPurpose());
        visit.setPhoto(dto.getPhoto());

        return visit;
    }

    public Visit toVisitUpdate(VisitUpdateDTO dto) {
        if (dto == null) {
            return null;
        }

        Visit visit = new Visit();

        visit.setCreatedAt(dto.getCreatedAt());
        visit.setId(dto.getId());
        visit.setDate(dto.getDate());
        visit.setPurpose(dto.getPurpose());
        visit.setPhoto(dto.getPhoto());

        return visit;
    }

    public VisitReadDTO toDto(Visit visit) {
        if (visit == null) {
            return null;
        }

        VisitReadDTO visitReadDTO = new VisitReadDTO();

        visitReadDTO.setId(visit.getId());
        visitReadDTO.setDate(visit.getDate());
        visitReadDTO.setPurpose(visit.getPurpose());
        visitReadDTO.setPhoto(visit.getPhoto());
        visitReadDTO.setUser(userMapper.toDto(visit.getUser()));
        visitReadDTO.setDonor(donorMapper.toDto(visit.getDonor()));

        return visitReadDTO;
    }

}
