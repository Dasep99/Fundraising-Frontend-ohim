package itc.fundraising.domain.guest;

import lombok.Builder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;
import java.util.UUID;



public interface GuestRepository extends JpaRepository<Guest, UUID> {
    Optional<Guest> findByName(String filename);
}