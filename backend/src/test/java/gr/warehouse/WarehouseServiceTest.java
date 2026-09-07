package gr.warehouse;

import gr.warehouse.model.Warehouse;
import gr.warehouse.repository.WarehouseRepository;
import gr.warehouse.service.WarehouseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WarehouseServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    private WarehouseService warehouseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        warehouseService = new WarehouseService(warehouseRepository);
    }

    @Test
    void getAllWarehousesShouldReturnAllWarehouses() {

        Warehouse warehouse1 = new Warehouse();
        warehouse1.setCode("WH001");
        warehouse1.setName("Main Warehouse");

        Warehouse warehouse2 = new Warehouse();
        warehouse2.setCode("WH002");
        warehouse2.setName("Second Warehouse");

        when(warehouseRepository.findAll())
                .thenReturn(Arrays.asList(warehouse1, warehouse2));

        List<Warehouse> result =
                warehouseService.getAllWarehouses();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("WH001", result.get(0).getCode());
        assertEquals("WH002", result.get(1).getCode());

        verify(warehouseRepository).findAll();
    }

    @Test
    void getWarehouseByIdShouldReturnWarehouseWhenExists() {

        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Main Warehouse");

        when(warehouseRepository.findById(1L))
                .thenReturn(Optional.of(warehouse));

        Optional<Warehouse> result =
                warehouseService.getWarehouseById(1L);

        assertTrue(result.isPresent());
        assertEquals("WH001", result.get().getCode());
        assertEquals("Main Warehouse", result.get().getName());

        verify(warehouseRepository).findById(1L);
    }

    @Test
    void getWarehouseByIdShouldReturnEmptyWhenNotExists() {

        when(warehouseRepository.findById(99L))
                .thenReturn(Optional.empty());

        Optional<Warehouse> result =
                warehouseService.getWarehouseById(99L);

        assertFalse(result.isPresent());

        verify(warehouseRepository).findById(99L);
    }

    @Test
    void createWarehouseShouldSaveAndReturnWarehouse() {

        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Main Warehouse");

        when(warehouseRepository.save(warehouse))
                .thenReturn(warehouse);

        Warehouse result =
                warehouseService.createWarehouse(warehouse);

        assertNotNull(result);
        assertEquals("WH001", result.getCode());
        assertEquals("Main Warehouse", result.getName());

        verify(warehouseRepository).save(warehouse);
    }

    @Test
    void updateWarehouseShouldUpdateAndReturnWarehouseWhenExists() {

        Warehouse existingWarehouse = new Warehouse();
        existingWarehouse.setCode("WH001");
        existingWarehouse.setName("Old Warehouse");
        existingWarehouse.setAddress("Old Address");
        existingWarehouse.setCapacity(100);

        Warehouse updatedWarehouse = new Warehouse();
        updatedWarehouse.setCode("WH001-UPDATED");
        updatedWarehouse.setName("New Warehouse");
        updatedWarehouse.setAddress("New Address");
        updatedWarehouse.setCapacity(200);

        when(warehouseRepository.findById(1L))
                .thenReturn(Optional.of(existingWarehouse));

        when(warehouseRepository.save(existingWarehouse))
                .thenReturn(existingWarehouse);

        Warehouse result =
                warehouseService.updateWarehouse(1L, updatedWarehouse);

        assertNotNull(result);
        assertEquals("WH001-UPDATED", result.getCode());
        assertEquals("New Warehouse", result.getName());
        assertEquals("New Address", result.getAddress());
        assertEquals(200, result.getCapacity());

        verify(warehouseRepository).findById(1L);
        verify(warehouseRepository).save(existingWarehouse);
    }

    @Test
    void updateWarehouseShouldReturnNullWhenWarehouseDoesNotExist() {

        Warehouse updatedWarehouse = new Warehouse();
        updatedWarehouse.setCode("WH001");
        updatedWarehouse.setName("New Warehouse");

        when(warehouseRepository.findById(99L))
                .thenReturn(Optional.empty());

        Warehouse result =
                warehouseService.updateWarehouse(99L, updatedWarehouse);

        assertNull(result);

        verify(warehouseRepository).findById(99L);
        verify(warehouseRepository, never()).save(any());
    }

    @Test
    void deleteWarehouseShouldReturnTrueWhenWarehouseExists() {

        when(warehouseRepository.existsById(1L))
                .thenReturn(true);

        boolean result =
                warehouseService.deleteWarehouse(1L);

        assertTrue(result);

        verify(warehouseRepository).existsById(1L);
        verify(warehouseRepository).deleteById(1L);
    }

    @Test
    void deleteWarehouseShouldReturnFalseWhenWarehouseDoesNotExist() {

        when(warehouseRepository.existsById(99L))
                .thenReturn(false);

        boolean result =
                warehouseService.deleteWarehouse(99L);

        assertFalse(result);

        verify(warehouseRepository).existsById(99L);
        verify(warehouseRepository, never()).deleteById(anyLong());
    }
}