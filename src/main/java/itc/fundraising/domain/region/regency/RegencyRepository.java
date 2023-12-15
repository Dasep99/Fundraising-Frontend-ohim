package itc.fundraising.domain.region.regency;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegencyRepository extends JpaRepository<Regency, String> {

    List<Regency> findByProvinceId(String provinceId);

}