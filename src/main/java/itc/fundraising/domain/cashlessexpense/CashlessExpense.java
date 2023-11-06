package itc.fundraising.domain.cashlessexpense;

import itc.fundraising.domain.user.User;
import itc.fundraising.enums.CashlessItem;
import itc.fundraising.enums.ExpenseDistribution;
import itc.fundraising.enums.ExpenseContract;
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
public class CashlessExpense extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    private String bbkNumber;

    @Enumerated(EnumType.STRING)
    private ExpenseContract contract;

    @Enumerated(EnumType.STRING)
    private ExpenseDistribution distribution;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<CashlessItem> items;

    private String bbkPhoto;

    private String otherInfo;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CashlessExpense that = (CashlessExpense) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
