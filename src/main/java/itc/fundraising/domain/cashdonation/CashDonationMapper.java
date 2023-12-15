package itc.fundraising.domain.cashdonation;

import itc.fundraising.domain.cashdonation.dto.CashDonationCreateDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationReadDTO;
import itc.fundraising.domain.cashdonation.dto.CashDonationUpdateDTO;
import itc.fundraising.domain.donor.DonorMapper;
import itc.fundraising.domain.user.UserMapper;
import itc.fundraising.enums.DonationContract;
import itc.fundraising.enums.DonationStatus;
import org.springframework.stereotype.Component;

@Component
public class CashDonationMapper {

    private final UserMapper userMapper;
    private final DonorMapper donorMapper;

    public CashDonationMapper(UserMapper userMapper, DonorMapper donorMapper) {
        this.userMapper = userMapper;
        this.donorMapper = donorMapper;
    }

    public CashDonation toCashDonationCreate(CashDonationCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        CashDonation cashDonation = new CashDonation();

        cashDonation.setDate(dto.getDate());
        if (dto.getContract() != null) {
            cashDonation.setContract(Enum.valueOf(DonationContract.class, dto.getContract().trim()));
        }
        cashDonation.setReceiptNumber(dto.getReceiptNumber());
        cashDonation.setAmount(dto.getAmount());
        cashDonation.setReceiptPhoto(dto.getReceiptPhoto());
        cashDonation.setStatus(DonationStatus.valueOf(dto.getStatus()));

        return cashDonation;
    }

    public CashDonation toCashDonationUpdate(CashDonationUpdateDTO dto) {
        if (dto == null) {
            return null;
        }

        CashDonation cashDonation = new CashDonation();

        cashDonation.setCreatedAt(dto.getCreatedAt());
        cashDonation.setId(dto.getId());
        cashDonation.setDate(dto.getDate());
        if (dto.getContract() != null) {
            cashDonation.setContract(Enum.valueOf(DonationContract.class, dto.getContract().trim()));
        }
        cashDonation.setReceiptNumber(dto.getReceiptNumber());
        cashDonation.setAmount(dto.getAmount());
        cashDonation.setReceiptPhoto(dto.getReceiptPhoto());
        cashDonation.setStatus(DonationStatus.valueOf(dto.getStatus()));

        return cashDonation;
    }

    public CashDonationReadDTO toDto(CashDonation cashDonation) {
        if (cashDonation == null) {
            return null;
        }

        CashDonationReadDTO cashDonationReadDTO = new CashDonationReadDTO();

        cashDonationReadDTO.setId(cashDonation.getId());
        cashDonationReadDTO.setDate(cashDonation.getDate());
        cashDonationReadDTO.setContract(cashDonation.getContract());
        cashDonationReadDTO.setReceiptNumber(cashDonation.getReceiptNumber());
        cashDonationReadDTO.setAmount(cashDonation.getAmount());
        cashDonationReadDTO.setReceiptPhoto(cashDonation.getReceiptPhoto());
        cashDonationReadDTO.setStatus(cashDonation.getStatus());
        cashDonationReadDTO.setUser(userMapper.toDto(cashDonation.getUser()));
        cashDonationReadDTO.setDonor(donorMapper.toDto(cashDonation.getDonor()));

        return cashDonationReadDTO;
    }

}
