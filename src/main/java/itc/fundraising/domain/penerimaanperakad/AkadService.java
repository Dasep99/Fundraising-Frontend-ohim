package itc.fundraising.domain.penerimaanperakad;

import itc.fundraising.domain.penerimaanperakad.dto.AkadCreateDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadReadDTO;
import itc.fundraising.domain.penerimaanperakad.dto.AkadUpdateDTO;
import itc.fundraising.utils.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AkadService {
    private final AkadRepository akadRepository;
    private final AkadMapper akadMapper;

    public AkadService(AkadRepository akadRepository, AkadMapper akadMapper) {
        this.akadRepository = akadRepository;
        this.akadMapper = akadMapper;
    }

    public List<AkadReadDTO> findAll() {
        List<Akad> akads = akadRepository.findAll();
        return akads.stream()
                .map(akadMapper::toDto)
                .toList();
    }

    public void create(AkadCreateDTO dto) {
        Akad akad = akadMapper.toAkadCreate(dto);
        akadRepository.save(akad);
    }

    public void update(AkadUpdateDTO dto) {
        Akad akad = akadRepository.findById(dto.getId())
                .map(d -> {
                    dto.setCreatedAt(d.getCreatedAt());
                    return akadMapper.toAkadUpdate(dto);
                }).orElseThrow(() -> new ResourceNotFoundException("Data Donatur tidak ditemukan, ID: " + dto.getId()));
        akadRepository.save(akad);
    }

    public void deleteById(UUID id) {
        Akad akad = akadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data Akad tidak ditemukan, ID: " + id));
        akadRepository.delete(akad);
    }
}
