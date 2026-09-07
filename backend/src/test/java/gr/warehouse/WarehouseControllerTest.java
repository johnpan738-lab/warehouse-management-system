package gr.warehouse;

import gr.warehouse.controller.WarehouseController;
import gr.warehouse.model.Warehouse;
import gr.warehouse.service.WarehouseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class WarehouseControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WarehouseService warehouseService;

    @InjectMocks
    private WarehouseController warehouseController;


    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(warehouseController)
                .build();
    }


    @Test
    void getAllWarehouses_shouldReturnAllWarehouses() throws Exception {

        Warehouse warehouse1 = new Warehouse();
        warehouse1.setCode("WH001");
        warehouse1.setName("Main Warehouse");
        warehouse1.setAddress("Athens");
        warehouse1.setCapacity(100);

        Warehouse warehouse2 = new Warehouse();
        warehouse2.setCode("WH002");
        warehouse2.setName("Second Warehouse");
        warehouse2.setAddress("Piraeus");
        warehouse2.setCapacity(200);

        when(warehouseService.getAllWarehouses())
                .thenReturn(Arrays.asList(warehouse1, warehouse2));

        mockMvc.perform(get("/warehouses"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("WH001")))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("WH002")));

        verify(warehouseService).getAllWarehouses();
    }


    @Test
    void getWarehouseById_shouldReturnWarehouse() throws Exception {

        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Main Warehouse");
        warehouse.setAddress("Athens");
        warehouse.setCapacity(100);

        when(warehouseService.getWarehouseById(1L))
                .thenReturn(Optional.of(warehouse));

        mockMvc.perform(get("/warehouses/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("WH001")))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("Main Warehouse")));

        verify(warehouseService).getWarehouseById(1L);
    }


    @Test
    void createWarehouse_shouldCreateWarehouse() throws Exception {

        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Main Warehouse");
        warehouse.setAddress("Athens");
        warehouse.setCapacity(100);

        when(warehouseService.createWarehouse(any(Warehouse.class)))
                .thenReturn(warehouse);

        String json =
                "{"
                        + "\"code\":\"WH001\","
                        + "\"name\":\"Main Warehouse\","
                        + "\"address\":\"Athens\","
                        + "\"capacity\":100"
                        + "}";

        mockMvc.perform(post("/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("WH001")))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("Main Warehouse")));

        verify(warehouseService)
                .createWarehouse(any(Warehouse.class));
    }


    @Test
    void updateWarehouse_shouldUpdateWarehouse() throws Exception {

        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Updated Warehouse");
        warehouse.setAddress("Thessaloniki");
        warehouse.setCapacity(300);

        when(warehouseService.updateWarehouse(
                eq(1L),
                any(Warehouse.class)
        )).thenReturn(warehouse);

        String json =
                "{"
                        + "\"code\":\"WH001\","
                        + "\"name\":\"Updated Warehouse\","
                        + "\"address\":\"Thessaloniki\","
                        + "\"capacity\":300"
                        + "}";

        mockMvc.perform(put("/warehouses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("WH001")))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("Updated Warehouse")))
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("Thessaloniki")));

        verify(warehouseService).updateWarehouse(
                eq(1L),
                any(Warehouse.class)
        );
    }


    @Test
    void deleteWarehouse_shouldReturnTrue() throws Exception {

        when(warehouseService.deleteWarehouse(1L))
                .thenReturn(true);

        mockMvc.perform(delete("/warehouses/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(warehouseService)
                .deleteWarehouse(1L);
    }
}