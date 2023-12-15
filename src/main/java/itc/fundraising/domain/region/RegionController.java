package itc.fundraising.domain.region;

import itc.fundraising.domain.region.province.Province;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/region")
public class RegionController {

    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    @GetMapping("/provinces")
    public ResponseEntity<List<Province>> findAllProvinces() {
        List<Province> data = regionService.findAllProvinces();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/regencies")
    public ResponseEntity<List<RegionReadDTO>> findRegenciesByProvinceId(@RequestParam("provinceId") String provinceId) {
        List<RegionReadDTO> data = regionService.findRegenciesByProvinceId(provinceId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<RegionReadDTO>> findDistrictsByRegencyId(@RequestParam("regencyId") String regencyId) {
        List<RegionReadDTO> data = regionService.findDistrictsByRegencyId(regencyId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/villages")
    public ResponseEntity<List<RegionReadDTO>> findVillagesByDistrictId(@RequestParam("districtId") String districtId) {
        List<RegionReadDTO> data = regionService.findVillagesByDistrictId(districtId);
        return ResponseEntity.ok(data);
    }

}
