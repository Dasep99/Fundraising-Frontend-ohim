package itc.fundraising.domain.region.village;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VillageRepository extends JpaRepository<Village, String> {

    List<Village> findByDistrictId(String districtId);

}