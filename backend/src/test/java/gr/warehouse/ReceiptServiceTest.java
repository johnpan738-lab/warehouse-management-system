package gr.warehouse;

import gr.warehouse.model.Product;
import gr.warehouse.model.Receipt;
import gr.warehouse.repository.ProductRepository;
import gr.warehouse.repository.ReceiptRepository;
import gr.warehouse.service.ReceiptService;
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
class ReceiptServiceTest {

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ReceiptService receiptService;

    private Product product;
    private Receipt receipt;

    @BeforeEach
    void setUp() {

        product = new Product();
        product.setCode("P001");
        product.setName("Laptop");
        product.setQuantity(10);

        receipt = new Receipt();
        receipt.setProductId(1L);
        receipt.setQuantity(5);
    }

    @Test
    void getAllReceipts_shouldReturnAllReceipts() {

        when(receiptRepository.findAll())
                .thenReturn(Arrays.asList(receipt));

        List<Receipt> result = receiptService.getAllReceipts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getQuantity());

        verify(receiptRepository).findAll();
    }

    @Test
    void getReceiptById_shouldReturnReceipt_whenReceiptExists() {

        when(receiptRepository.findById(1L))
                .thenReturn(Optional.of(receipt));

        Optional<Receipt> result =
                receiptService.getReceiptById(1L);

        assertTrue(result.isPresent());
        assertEquals(5, result.get().getQuantity());

        verify(receiptRepository).findById(1L);
    }

    @Test
    void getReceiptById_shouldReturnEmpty_whenReceiptDoesNotExist() {

        when(receiptRepository.findById(99L))
                .thenReturn(Optional.empty());

        Optional<Receipt> result =
                receiptService.getReceiptById(99L);

        assertFalse(result.isPresent());

        verify(receiptRepository).findById(99L);
    }

    @Test
    void createReceipt_shouldUpdateProductAndSaveReceipt() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        when(receiptRepository.save(receipt))
                .thenReturn(receipt);

        Receipt result =
                receiptService.createReceipt(receipt);

        assertNotNull(result);

        assertEquals("P001", receipt.getProductCode());
        assertEquals("Laptop", receipt.getProduct());

        assertEquals(15, product.getQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(receiptRepository).save(receipt);
    }

    @Test
    void createReceipt_shouldThrowException_whenQuantityIsZeroOrNegative() {

        receipt.setQuantity(0);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> receiptService.createReceipt(receipt)
        );

        assertEquals(
                "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0.",
                exception.getMessage()
        );

        verifyNoInteractions(productRepository);
        verifyNoInteractions(receiptRepository);
    }

    @Test
    void createReceipt_shouldThrowException_whenProductDoesNotExist() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> receiptService.createReceipt(receipt)
        );

        assertEquals(
                "Το προϊόν δεν βρέθηκε.",
                exception.getMessage()
        );

        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any());
        verifyNoInteractions(receiptRepository);
    }

    @Test
    void deleteReceipt_shouldDeleteReceiptAndDecreaseProductQuantity() {

        when(receiptRepository.findById(1L))
                .thenReturn(Optional.of(receipt));

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        boolean result =
                receiptService.deleteReceipt(1L);

        assertTrue(result);

        assertEquals(5, product.getQuantity());

        verify(receiptRepository).findById(1L);
        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(receiptRepository).deleteById(1L);
    }

    @Test
    void deleteReceipt_shouldReturnFalse_whenReceiptDoesNotExist() {

        when(receiptRepository.findById(99L))
                .thenReturn(Optional.empty());

        boolean result =
                receiptService.deleteReceipt(99L);

        assertFalse(result);

        verify(receiptRepository).findById(99L);
        verify(receiptRepository, never()).deleteById(anyLong());
        verifyNoInteractions(productRepository);
    }
}