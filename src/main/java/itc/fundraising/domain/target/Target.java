package itc.fundraising.domain.target;

import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.transferdonation.TransferDonation;
import itc.fundraising.domain.user.User;
import itc.fundraising.enums.UserWorkArea;
import itc.fundraising.utils.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@ToString
@RequiredArgsConstructor

public class Target extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private UserWorkArea unit;

    private Integer inputTarget;



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TransferDonation that = (TransferDonation) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
