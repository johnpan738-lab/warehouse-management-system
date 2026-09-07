package gr.warehouse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "receipts")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String receiptCode;

    private Long productId;

    private String productCode;

    private String product;

    private int quantity;

    private String warehouse;

    private String date;

    public Receipt() {
    }

    public Receipt(
            String receiptCode,
            Long productId,
            String productCode,
            String product,
            int quantity,
            String warehouse,
            String date
    ) {
        this.receiptCode = receiptCode;
        this.productId = productId;
        this.productCode = productCode;
        this.product = product;
        this.quantity = quantity;
        this.warehouse = warehouse;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiptCode() {
        return receiptCode;
    }

    public void setReceiptCode(String receiptCode) {
        this.receiptCode = receiptCode;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(String warehouse) {
        this.warehouse = warehouse;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}