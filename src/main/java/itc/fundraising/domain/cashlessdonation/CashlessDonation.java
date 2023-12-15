package itc.fundraising.domain.cashlessdonation;

import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.user.User;
import itc.fundraising.enums.CashlessContract;
import itc.fundraising.enums.CashlessItem;
import itc.fundraising.utils.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class CashlessDonation extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private CashlessContract contract;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<CashlessItem> items;

    private String receiptNumber;

    private String receiptPhoto;

    private String otherInfo;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    @ToString.Exclude
    private Donor donor;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CashlessDonation that = (CashlessDonation) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
