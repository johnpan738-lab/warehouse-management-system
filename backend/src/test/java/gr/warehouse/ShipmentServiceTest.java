package gr.warehouse;

import gr.warehouse.model.Product;
import gr.warehouse.model.Shipment;
import gr.warehouse.repository.ProductRepository;
import gr.warehouse.repository.ShipmentRepository;
import gr.warehouse.service.ShipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ShipmentService shipmentService;

    private Product product;
    private Shipment shipment;

    @BeforeEach
    void setUp() {

        product = new Product();
        product.setCode("P001");
        product.setName("Laptop");
        product.setQuantity(10);

        shipment = new Shipment();
        shipment.setProductId(1L);
        shipment.setQuantity(5);
    }

    @Test
    void getAllShipments_shouldReturnAllShipments() {

        when(shipmentRepository.findAll())
                .thenReturn(Arrays.asList(shipment));

        List<Shipment> result =
                shipmentService.getAllShipments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getQuantity());

        verify(shipmentRepository).findAll();
    }

    @Test
    void getShipmentById_shouldReturnShipment_whenShipmentExists() {

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(shipment));

        Optional<Shipment> result =
                shipmentService.getShipmentById(1L);

        assertTrue(result.isPresent());
        assertEquals(5, result.get().getQuantity());

        verify(shipmentRepository).findById(1L);
    }

    @Test
    void getShipmentById_shouldReturnEmpty_whenShipmentDoesNotExist() {

        when(shipmentRepository.findById(99L))
                .thenReturn(Optional.empty());

        Optional<Shipment> result =
                shipmentService.getShipmentById(99L);

        assertFalse(result.isPresent());

        verify(shipmentRepository).findById(99L);
    }

    @Test
    void createShipment_shouldDecreaseProductQuantityAndSaveShipment() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        when(shipmentRepository.save(shipment))
                .thenReturn(shipment);

        Shipment result =
                shipmentService.createShipment(shipment);

        assertNotNull(result);

        assertEquals(5, product.getQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(shipmentRepository).save(shipment);
    }

    @Test
    void createShipment_shouldThrowException_whenProductDoesNotExist() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> shipmentService.createShipment(shipment)
        );

        assertEquals(
                "Το προϊόν δεν βρέθηκε.",
                exception.getMessage()
        );

        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any());
        verifyNoInteractions(shipmentRepository);
    }

    @Test
    void createShipment_shouldThrowException_whenNotEnoughStock() {

        shipment.setQuantity(15);

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> shipmentService.createShipment(shipment)
        );

        assertEquals(
                "Δεν υπάρχει αρκετό απόθεμα για την αποστολή.",
                exception.getMessage()
        );

        assertEquals(10, product.getQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any());
        verifyNoInteractions(shipmentRepository);
    }

    @Test
    void deleteShipment_shouldDeleteShipmentAndIncreaseProductQuantity() {

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(shipment));

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        boolean result =
                shipmentService.deleteShipment(1L);

        assertTrue(result);

        assertEquals(15, product.getQuantity());

        verify(shipmentRepository).findById(1L);
        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(shipmentRepository).deleteById(1L);
    }

    @Test
    void deleteShipment_shouldReturnFalse_whenShipmentDoesNotExist() {

        when(shipmentRepository.findById(99L))
                .thenReturn(Optional.empty());

        boolean result =
                shipmentService.deleteShipment(99L);

        assertFalse(result);

        verify(shipmentRepository).findById(99L);
        verify(shipmentRepository, never()).deleteById(anyLong());
        verifyNoInteractions(productRepository);
    }
}