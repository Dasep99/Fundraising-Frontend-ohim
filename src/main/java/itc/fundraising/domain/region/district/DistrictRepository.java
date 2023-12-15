package itc.fundraising.domain.region.district;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, String> {

    List<District> findByRegencyId(String regencyId);

}