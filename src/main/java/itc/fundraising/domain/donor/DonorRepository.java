package itc.fundraising.domain.donor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DonorRepository extends JpaRepository<Donor, UUID> {

}