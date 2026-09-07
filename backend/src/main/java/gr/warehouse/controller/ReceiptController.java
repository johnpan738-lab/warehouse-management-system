package gr.warehouse.controller;

import gr.warehouse.model.Receipt;
import gr.warehouse.service.ReceiptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receipts")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping
    public List<Receipt> getAllReceipts() {
        return receiptService.getAllReceipts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(
            @PathVariable("id") Long id) {

        return receiptService.getReceiptById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public ResponseEntity<Receipt> createReceipt(
            @RequestBody Receipt receipt) {

        return ResponseEntity.ok(
                receiptService.createReceipt(receipt)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(
            @PathVariable("id") Long id,
            @RequestBody Receipt receipt) {

        return receiptService.updateReceipt(id, receipt)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(
            @PathVariable("id") Long id) {

        if (!receiptService.deleteReceipt(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}