package itc.fundraising.domain.cashdeposit;

import itc.fundraising.domain.cashdeposit.dto.CashDepositCreateDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositReadDTO;
import itc.fundraising.domain.cashdeposit.dto.CashDepositUpdateDTO;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DepositContract;
import org.springframework.stereotype.Component;

@Component
public class CashDepositMapper {

    private final UserMapper userMapper;

    public CashDepositMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CashDeposit toCashDepositCreate(CashDepositCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashDeposit cashDeposit = new CashDeposit();

        cashDeposit.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            cashDeposit.setContract( Enum.valueOf( DepositContract.class, dto.getContract().trim() ) );
        }
        cashDeposit.setAmount( dto.getAmount() );
        cashDeposit.setReceiptPhoto( dto.getReceiptPhoto() );

        return cashDeposit;
    }

    public CashDeposit toCashDepositUpdate(CashDepositUpdateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CashDeposit cashDeposit = new CashDeposit();

        cashDeposit.setCreatedAt( dto.getCreatedAt() );
        cashDeposit.setId( dto.getId() );
        cashDeposit.setDate( dto.getDate() );
        if ( dto.getContract() != null ) {
            cashDeposit.setContract( Enum.valueOf( DepositContract.class, dto.getContract().trim() ) );
        }
        cashDeposit.setAmount( dto.getAmount() );
        cashDeposit.setReceiptPhoto( dto.getReceiptPhoto() );

        return cashDeposit;
    }

    public CashDepositReadDTO toDto(CashDeposit cashDeposit) {
        if ( cashDeposit == null ) {
            return null;
        }

        CashDepositReadDTO cashDepositReadDTO = new CashDepositReadDTO();

        cashDepositReadDTO.setId( cashDeposit.getId() );
        cashDepositReadDTO.setDate( cashDeposit.getDate() );
        cashDepositReadDTO.setContract( cashDeposit.getContract() );
        cashDepositReadDTO.setAmount( cashDeposit.getAmount() );
        cashDepositReadDTO.setReceiptPhoto( cashDeposit.getReceiptPhoto() );
        cashDepositReadDTO.setUser( userMapper.toDto( cashDeposit.getUser() ) );

        return cashDepositReadDTO;
    }

}
