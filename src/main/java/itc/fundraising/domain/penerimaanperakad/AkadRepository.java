package itc.fundraising.domain.penerimaanperakad;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AkadRepository extends JpaRepository<Akad, UUID> {
}
