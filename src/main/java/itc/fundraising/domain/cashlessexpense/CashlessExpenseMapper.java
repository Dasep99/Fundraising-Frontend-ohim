package itc.fundraising.domain.cashlessexpense;

import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseCreateDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseReadDTO;
import itc.fundraising.domain.cashlessexpense.dto.CashlessExpenseUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.CashlessItem;
import itc.fundraising.enums.ExpenseContract;
import itc.fundraising.enums.ExpenseDistribution;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CashlessExpenseMapper {

    private final UserMapper userMapper;

    public CashlessExpenseMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CashlessExpense toCashlessExpenseCreate(CashlessExpenseCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashlessExpense cashlessExpense = new CashlessExpense();

        cashlessExpense.setDate( dto.getDate() );
        cashlessExpense.setBbkNumber( dto.getBbkNumber() );
        if ( dto.getContract() != null ) {
            cashlessExpense.setContract( Enum.valueOf( ExpenseContract.class, dto.getContract().trim() ) );
        }
        if ( dto.getDistribution() != null ) {
            cashlessExpense.setDistribution( Enum.valueOf( ExpenseDistribution.class, dto.getDistribution().trim() ) );
        }
        List<CashlessItem> list = dto.getItems();
        if ( list != null ) {
            cashlessExpense.setItems(new ArrayList<>(list) );
        }
        cashlessExpense.setBbkPhoto( dto.getBbkPhoto() );
        cashlessExpense.setOtherInfo( dto.getOtherInfo() );

        return cashlessExpense;
    }

    public CashlessExpense toCashlessExpenseUpdate(CashlessExpenseUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashlessExpense cashlessExpense = new CashlessExpense();

        cashlessExpense.setCreatedAt( dto.getCreatedAt() );
        cashlessExpense.setId( dto.getId() );
        cashlessExpense.setDate( dto.getDate() );
        cashlessExpense.setBbkNumber( dto.getBbkNumber() );
        if ( dto.getContract() != null ) {
            cashlessExpense.setContract( Enum.valueOf( ExpenseContract.class, dto.getContract().trim() ) );
        }
        if ( dto.getDistribution() != null ) {
            cashlessExpense.setDistribution( Enum.valueOf( ExpenseDistribution.class, dto.getDistribution().trim() ) );
        }
        List<CashlessItem> list = dto.getItems();
        if ( list != null ) {
            cashlessExpense.setItems(new ArrayList<>(list) );
        }
        cashlessExpense.setBbkPhoto( dto.getBbkPhoto() );
        cashlessExpense.setOtherInfo( dto.getOtherInfo() );

        return cashlessExpense;
    }

    public CashlessExpenseReadDTO toDto(CashlessExpense cashlessExpense) {
        if ( cashlessExpense == null ) {
            return null;
        }

        CashlessExpenseReadDTO cashlessExpenseReadDTO = new CashlessExpenseReadDTO();

        cashlessExpenseReadDTO.setId( cashlessExpense.getId() );
        cashlessExpenseReadDTO.setDate( cashlessExpense.getDate() );
        cashlessExpenseReadDTO.setBbkNumber( cashlessExpense.getBbkNumber() );
        cashlessExpenseReadDTO.setContract( cashlessExpense.getContract() );
        cashlessExpenseReadDTO.setDistribution( cashlessExpense.getDistribution() );
        List<CashlessItem> list = cashlessExpense.getItems();
        if ( list != null ) {
            cashlessExpenseReadDTO.setItems(new ArrayList<>(list) );
        }
        cashlessExpenseReadDTO.setBbkPhoto( cashlessExpense.getBbkPhoto() );
        cashlessExpenseReadDTO.setOtherInfo( cashlessExpense.getOtherInfo() );
        cashlessExpenseReadDTO.setUser( userMapper.toDto( cashlessExpense.getUser() ) );

        return cashlessExpenseReadDTO;
    }

}
