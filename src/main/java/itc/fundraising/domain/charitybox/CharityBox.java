package itc.fundraising.domain.charitybox;

import itc.fundraising.domain.user.User;
import itc.fundraising.enums.CharityBoxInfo;
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
public class CharityBox extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private CharityBoxInfo charityBoxInfo;

    private String outletName;

    private String code;

    private String address;

    private String ownerName;

    private String phoneNumber;

    private LocalDate depositDate;

    private String outletPhoto;

    private String coordinates;

    private String otherInfo;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CharityBox that = (CharityBox) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
