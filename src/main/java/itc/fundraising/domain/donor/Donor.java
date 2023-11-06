package itc.fundraising.domain.donor;

import itc.fundraising.domain.user.User;
import itc.fundraising.enums.DonorType;
import itc.fundraising.utils.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Donor extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String phoneNumber;

    private String address;

    private String email;

    @Enumerated(EnumType.STRING)
    private DonorType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Donor donor = (Donor) o;
        return getId() != null && Objects.equals(getId(), donor.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
