package itc.fundraising.domain.cashdonation;

import itc.fundraising.domain.donor.Donor;
import itc.fundraising.domain.user.User;
import itc.fundraising.enums.DonationContract;
import itc.fundraising.utils.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import java.io.Serial;
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
public class CashDonation extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private DonationContract contract;

    private String receiptNumber;

    private Integer amount;

    private String receiptPhoto;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    @ToString.Exclude
    private Donor donor;

    @Column(name = "donor_id", insertable = false, updatable = false)
    private UUID donor_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CashDonation that = (CashDonation) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
