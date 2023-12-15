package itc.fundraising.domain.pickupdonation;

import itc.fundraising.domain.charitybox.CharityBox;
import itc.fundraising.domain.user.User;
import itc.fundraising.enums.PickUpInfo;
import itc.fundraising.utils.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
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
public class PickUpDonation extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private PickUpInfo pickUpInfo;

    private Integer amount;

    private String contract;

    private String receiptNumber;

    private String photo;

    private String replaced;

    private String otherInfo;

    @OneToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @OneToOne
    @JoinColumn(name = "charity_box_id")
    @ToString.Exclude
    private CharityBox charityBox;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PickUpDonation that = (PickUpDonation) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
