package gr.warehouse;

import gr.warehouse.model.Product;
import gr.warehouse.repository.ProductRepository;
import gr.warehouse.service.ProductService;
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
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();

        product.setId(1L);
        product.setCode("PRD-001");
        product.setName("Laptop");
        product.setCategory("Electronics");
        product.setPrice(1000.0);
        product.setQuantity(10);
        product.setLocation("Warehouse A");
    }

    @Test
    void getAllProducts_shouldReturnAllProducts() {

        when(productRepository.findAll())
                .thenReturn(Arrays.asList(product));

        List<Product> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());

        verify(productRepository).findAll();
    }

    @Test
    void getProductById_shouldReturnProduct_whenProductExists() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        Optional<Product> result =
                productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getName());

        verify(productRepository).findById(1L);
    }

    @Test
    void getProductById_shouldReturnEmpty_whenProductDoesNotExist() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        Optional<Product> result =
                productService.getProductById(99L);

        assertFalse(result.isPresent());

        verify(productRepository).findById(99L);
    }

    @Test
    void createProduct_shouldSaveAndReturnProduct() {

        when(productRepository.save(product))
                .thenReturn(product);

        Product result =
                productService.createProduct(product);

        assertNotNull(result);
        assertEquals("PRD-001", result.getCode());
        assertEquals("Laptop", result.getName());

        verify(productRepository).save(product);
    }

    @Test
    void addQuantity_shouldIncreaseQuantity_whenProductExists() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        Product result =
                productService.addQuantity(1L, 5);

        assertNotNull(result);
        assertEquals(15, result.getQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    @Test
    void addQuantity_shouldReturnNull_whenProductDoesNotExist() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        Product result =
                productService.addQuantity(99L, 5);

        assertNull(result);

        verify(productRepository).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_shouldUpdateAndReturnProduct_whenProductExists() {

        Product updatedProduct = new Product();

        updatedProduct.setCode("PRD-002");
        updatedProduct.setName("Gaming Laptop");
        updatedProduct.setCategory("Gaming");
        updatedProduct.setPrice(1500.0);
        updatedProduct.setQuantity(20);
        updatedProduct.setLocation("Warehouse B");

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(product))
                .thenReturn(product);

        Product result =
                productService.updateProduct(1L, updatedProduct);

        assertNotNull(result);
        assertEquals("PRD-002", result.getCode());
        assertEquals("Gaming Laptop", result.getName());
        assertEquals("Gaming", result.getCategory());
        assertEquals(1500.0, result.getPrice());
        assertEquals(20, result.getQuantity());
        assertEquals("Warehouse B", result.getLocation());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    @Test
    void updateProduct_shouldReturnNull_whenProductDoesNotExist() {

        Product updatedProduct = new Product();

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        Product result =
                productService.updateProduct(99L, updatedProduct);

        assertNull(result);

        verify(productRepository).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteProduct_shouldDeleteAndReturnTrue_whenProductExists() {

        when(productRepository.existsById(1L))
                .thenReturn(true);

        boolean result =
                productService.deleteProduct(1L);

        assertTrue(result);

        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteProduct_shouldReturnFalse_whenProductDoesNotExist() {

        when(productRepository.existsById(99L))
                .thenReturn(false);

        boolean result =
                productService.deleteProduct(99L);

        assertFalse(result);

        verify(productRepository).existsById(99L);
        verify(productRepository, never()).deleteById(99L);
    }
}