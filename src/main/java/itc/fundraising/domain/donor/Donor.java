package itc.fundraising.domain.donor;

import itc.fundraising.domain.region.district.District;
import itc.fundraising.domain.region.province.Province;
import itc.fundraising.domain.region.regency.Regency;
import itc.fundraising.domain.region.village.Village;
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
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "donor", uniqueConstraints = {@UniqueConstraint(name = "uk_nik", columnNames = "nik"),
        @UniqueConstraint(name = "uk_phone_number", columnNames = "phone_number"),
        @UniqueConstraint(name = "uk_email", columnNames = "email")})
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

    private String donorId;

    private String nik;

    private String name;

    private String gender;

    private LocalDate birthDate;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String street;

    @ManyToOne
    @JoinColumn(name = "province_id")
    @ToString.Exclude
    private Province province;

    @ManyToOne
    @JoinColumn(name = "regency_id")
    @ToString.Exclude
    private Regency regency;

    @ManyToOne
    @JoinColumn(name = "district_id")
    @ToString.Exclude
    private District district;

    @ManyToOne
    @JoinColumn(name = "village_id")
    @ToString.Exclude
    private Village village;

    private String email;

    private String job;

    @Enumerated(EnumType.STRING)
    private DonorType type;

    private String otherInfo;

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
