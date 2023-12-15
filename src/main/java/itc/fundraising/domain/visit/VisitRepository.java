package itc.fundraising.domain.visit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {

    List<Visit> findAllByOrderByDateDescUser_WorkAreaAsc();

}