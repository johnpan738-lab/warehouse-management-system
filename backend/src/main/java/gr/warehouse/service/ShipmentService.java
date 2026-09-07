package gr.warehouse.service;

import gr.warehouse.model.Product;
import gr.warehouse.model.Shipment;
import gr.warehouse.repository.ProductRepository;
import gr.warehouse.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;

    public ShipmentService(
            ShipmentRepository shipmentRepository,
            ProductRepository productRepository) {

        this.shipmentRepository = shipmentRepository;
        this.productRepository = productRepository;
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Optional<Shipment> getShipmentById(Long id) {
        return shipmentRepository.findById(id);
    }

    @Transactional
    public Shipment createShipment(Shipment shipment) {

        if (shipment.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0."
            );
        }

        Optional<Product> optionalProduct =
                productRepository.findById(shipment.getProductId());

        if (!optionalProduct.isPresent()) {
            throw new RuntimeException(
                    "Το προϊόν δεν βρέθηκε."
            );
        }

        Product product = optionalProduct.get();

        if (product.getQuantity() < shipment.getQuantity()) {
            throw new RuntimeException(
                    "Δεν υπάρχει αρκετό απόθεμα για την αποστολή."
            );
        }

        shipment.setProduct(product.getName());

        product.setQuantity(
                product.getQuantity() - shipment.getQuantity()
        );

        productRepository.save(product);

        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Optional<Shipment> updateShipment(
            Long id,
            Shipment updatedShipment) {

        if (updatedShipment.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0."
            );
        }

        Optional<Shipment> optionalShipment =
                shipmentRepository.findById(id);

        if (!optionalShipment.isPresent()) {
            return Optional.empty();
        }

        Shipment existingShipment = optionalShipment.get();

        Optional<Product> oldProductOptional =
                productRepository.findById(
                        existingShipment.getProductId()
                );

        if (!oldProductOptional.isPresent()) {
            throw new RuntimeException(
                    "Το παλιό προϊόν δεν βρέθηκε."
            );
        }

        Product oldProduct = oldProductOptional.get();

        /*
         * Επιστρέφουμε την ποσότητα της παλιάς
         * αποστολής στο απόθεμα.
         */
        oldProduct.setQuantity(
                oldProduct.getQuantity()
                        + existingShipment.getQuantity()
        );

        productRepository.save(oldProduct);

        /*
         * Βρίσκουμε το προϊόν της νέας αποστολής.
         */
        Optional<Product> newProductOptional =
                productRepository.findById(
                        updatedShipment.getProductId()
                );

        if (!newProductOptional.isPresent()) {
            throw new RuntimeException(
                    "Το νέο προϊόν δεν βρέθηκε."
            );
        }

        Product newProduct = newProductOptional.get();

        /*
         * Έλεγχος διαθέσιμου αποθέματος.
         */
        if (newProduct.getQuantity()
                < updatedShipment.getQuantity()) {

            /*
             * Επαναφέρουμε την προηγούμενη κατάσταση.
             */
            oldProduct.setQuantity(
                    oldProduct.getQuantity()
                            - existingShipment.getQuantity()
            );

            productRepository.save(oldProduct);

            throw new RuntimeException(
                    "Δεν υπάρχει αρκετό απόθεμα για τη νέα αποστολή."
            );
        }

        /*
         * Αυτόματη συμπλήρωση ονόματος προϊόντος.
         */
        updatedShipment.setProduct(
                newProduct.getName()
        );

        /*
         * Αφαιρούμε τη νέα ποσότητα από το απόθεμα.
         */
        newProduct.setQuantity(
                newProduct.getQuantity()
                        - updatedShipment.getQuantity()
        );

        productRepository.save(newProduct);

        /*
         * Ενημέρωση της υπάρχουσας αποστολής.
         */
        existingShipment.setShipmentCode(
                updatedShipment.getShipmentCode()
        );

        existingShipment.setProductId(
                updatedShipment.getProductId()
        );

        existingShipment.setProduct(
                updatedShipment.getProduct()
        );

        existingShipment.setQuantity(
                updatedShipment.getQuantity()
        );

        existingShipment.setWarehouse(
                updatedShipment.getWarehouse()
        );

        existingShipment.setDestination(
                updatedShipment.getDestination()
        );

        existingShipment.setDate(
                updatedShipment.getDate()
        );

        return Optional.of(
                shipmentRepository.save(existingShipment)
        );
    }

    @Transactional
    public boolean deleteShipment(Long id) {

        Optional<Shipment> optionalShipment =
                shipmentRepository.findById(id);

        if (!optionalShipment.isPresent()) {
            return false;
        }

        Shipment shipment = optionalShipment.get();

        Optional<Product> optionalProduct =
                productRepository.findById(
                        shipment.getProductId()
                );

        if (optionalProduct.isPresent()) {

            Product product = optionalProduct.get();

            product.setQuantity(
                    product.getQuantity()
                            + shipment.getQuantity()
            );

            productRepository.save(product);
        }

        shipmentRepository.deleteById(id);

        return true;
    }
}