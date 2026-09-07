package gr.warehouse.service;

import gr.warehouse.model.Product;
import gr.warehouse.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product addQuantity(Long id, int quantity) {

        Optional<Product> existingProduct =
                productRepository.findById(id);

        if (!existingProduct.isPresent()) {
            return null;
        }

        Product product = existingProduct.get();

        product.setQuantity(product.getQuantity() + quantity);

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {

        Optional<Product> existingProduct =
                productRepository.findById(id);

        if (!existingProduct.isPresent()) {
            return null;
        }

        Product product = existingProduct.get();

        product.setName(updatedProduct.getName());
        product.setCode(updatedProduct.getCode());
        product.setCategory(updatedProduct.getCategory());
        product.setPrice(updatedProduct.getPrice());
        product.setQuantity(updatedProduct.getQuantity());
        product.setLocation(updatedProduct.getLocation());

        return productRepository.save(product);
    }

    public boolean deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            return false;
        }

        productRepository.deleteById(id);
        return true;
    }
}