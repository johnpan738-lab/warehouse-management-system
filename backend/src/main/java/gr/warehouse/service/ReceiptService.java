package gr.warehouse.service;

import gr.warehouse.model.Product;
import gr.warehouse.model.Receipt;
import gr.warehouse.repository.ProductRepository;
import gr.warehouse.repository.ReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ProductRepository productRepository;

    public ReceiptService(
            ReceiptRepository receiptRepository,
            ProductRepository productRepository) {

        this.receiptRepository = receiptRepository;
        this.productRepository = productRepository;
    }

    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    public Optional<Receipt> getReceiptById(Long id) {
        return receiptRepository.findById(id);
    }

    @Transactional
    public Receipt createReceipt(Receipt receipt) {

        if (receipt.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0."
            );
        }

        Optional<Product> optionalProduct =
                productRepository.findById(receipt.getProductId());

        if (!optionalProduct.isPresent()) {
            throw new RuntimeException(
                    "Το προϊόν δεν βρέθηκε."
            );
        }

        Product product = optionalProduct.get();

        receipt.setProductCode(product.getCode());
        receipt.setProduct(product.getName());

        product.setQuantity(
                product.getQuantity() + receipt.getQuantity()
        );

        productRepository.save(product);

        return receiptRepository.save(receipt);
    }

    @Transactional
    public Optional<Receipt> updateReceipt(
            Long id,
            Receipt updatedReceipt) {

        if (updatedReceipt.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0."
            );
        }

        Optional<Receipt> optionalReceipt =
                receiptRepository.findById(id);

        if (!optionalReceipt.isPresent()) {
            return Optional.empty();
        }

        Receipt existingReceipt = optionalReceipt.get();

        Optional<Product> oldProductOptional =
                productRepository.findById(
                        existingReceipt.getProductId()
                );

        if (!oldProductOptional.isPresent()) {
            throw new RuntimeException(
                    "Το παλιό προϊόν δεν βρέθηκε."
            );
        }

        Product oldProduct = oldProductOptional.get();

        /*
         * Αφαιρούμε την παλιά ποσότητα
         * από το παλιό προϊόν.
         */
        int oldProductQuantity =
                oldProduct.getQuantity()
                        - existingReceipt.getQuantity();

        oldProduct.setQuantity(
                Math.max(oldProductQuantity, 0)
        );

        productRepository.save(oldProduct);

        /*
         * Βρίσκουμε το νέο προϊόν.
         */
        Optional<Product> newProductOptional =
                productRepository.findById(
                        updatedReceipt.getProductId()
                );

        if (!newProductOptional.isPresent()) {
            throw new RuntimeException(
                    "Το νέο προϊόν δεν βρέθηκε."
            );
        }

        Product newProduct = newProductOptional.get();

        /*
         * Αυτόματη συμπλήρωση στοιχείων προϊόντος.
         */
        updatedReceipt.setProductCode(
                newProduct.getCode()
        );

        updatedReceipt.setProduct(
                newProduct.getName()
        );

        /*
         * Προσθέτουμε τη νέα ποσότητα
         * στο νέο προϊόν.
         */
        newProduct.setQuantity(
                newProduct.getQuantity()
                        + updatedReceipt.getQuantity()
        );

        productRepository.save(newProduct);

        /*
         * Ενημέρωση της υπάρχουσας παραλαβής.
         */
        existingReceipt.setReceiptCode(
                updatedReceipt.getReceiptCode()
        );

        existingReceipt.setProductId(
                updatedReceipt.getProductId()
        );

        existingReceipt.setProductCode(
                updatedReceipt.getProductCode()
        );

        existingReceipt.setProduct(
                updatedReceipt.getProduct()
        );

        existingReceipt.setQuantity(
                updatedReceipt.getQuantity()
        );

        existingReceipt.setWarehouse(
                updatedReceipt.getWarehouse()
        );

        existingReceipt.setDate(
                updatedReceipt.getDate()
        );

        return Optional.of(
                receiptRepository.save(existingReceipt)
        );
    }

    @Transactional
    public boolean deleteReceipt(Long id) {

        Optional<Receipt> optionalReceipt =
                receiptRepository.findById(id);

        if (!optionalReceipt.isPresent()) {
            return false;
        }

        Receipt receipt = optionalReceipt.get();

        Optional<Product> optionalProduct =
                productRepository.findById(receipt.getProductId());

        if (optionalProduct.isPresent()) {

            Product product = optionalProduct.get();

            int newQuantity =
                    product.getQuantity()
                            - receipt.getQuantity();

            product.setQuantity(
                    Math.max(newQuantity, 0)
            );

            productRepository.save(product);
        }

        receiptRepository.deleteById(id);

        return true;
    }
}