package gr.warehouse.service;

import gr.warehouse.model.Warehouse;
import gr.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Optional<Warehouse> getWarehouseById(Long id) {
        return warehouseRepository.findById(id);
    }

    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, Warehouse updatedWarehouse) {
        Optional<Warehouse> existingWarehouse =
                warehouseRepository.findById(id);

        if (!existingWarehouse.isPresent()) {
            return null;
        }

        Warehouse warehouse = existingWarehouse.get();

        warehouse.setCode(updatedWarehouse.getCode());
        warehouse.setName(updatedWarehouse.getName());
        warehouse.setAddress(updatedWarehouse.getAddress());
        warehouse.setCapacity(updatedWarehouse.getCapacity());

        return warehouseRepository.save(warehouse);
    }

    public boolean deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) {
            return false;
        }

        warehouseRepository.deleteById(id);
        return true;
    }
}
