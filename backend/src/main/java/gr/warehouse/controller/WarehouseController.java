package gr.warehouse.controller;

import gr.warehouse.model.Warehouse;
import gr.warehouse.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/warehouses")
@CrossOrigin(origins = "http://localhost:5173")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }

    @GetMapping("/{id}")
    public Optional<Warehouse> getWarehouseById(
            @PathVariable("id") Long id
    ) {
        return warehouseService.getWarehouseById(id);
    }

    @PostMapping
    public Warehouse createWarehouse(
            @RequestBody Warehouse warehouse
    ) {
        return warehouseService.createWarehouse(warehouse);
    }

    @PutMapping("/{id}")
    public Warehouse updateWarehouse(
            @PathVariable("id") Long id,
            @RequestBody Warehouse warehouse
    ) {
        return warehouseService.updateWarehouse(id, warehouse);
    }

    @DeleteMapping("/{id}")
    public boolean deleteWarehouse(
            @PathVariable("id") Long id
    ) {
        return warehouseService.deleteWarehouse(id);
    }
}