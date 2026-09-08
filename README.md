# Warehouse Management System (WMS)

## 1. Περιγραφή Project

Για το τελικό project του Coding Factory έφτιαξα ένα Warehouse Management System (WMS), δηλαδή μια εφαρμογή για τη διαχείριση μιας αποθήκης.

Στόχος μου ήταν να μπορώ μέσα από την εφαρμογή να διαχειρίζομαι προϊόντα, αποθήκες, παραλαβές και αποστολές και να βλέπω ανά πάσα στιγμή το διαθέσιμο stock.

Το project αποτελείται από backend σε Java / Spring Boot και frontend σε React / TypeScript. Για τη βάση δεδομένων χρησιμοποίησα H2.

---

## 2. Τι περιλαμβάνει η εφαρμογή

Στην εφαρμογή έχω υλοποιήσει:

- Login και Register
- Logout
- Κρυπτογράφηση password με BCrypt
- Διαχείριση προϊόντων
- Διαχείριση αποθηκών
- Παραλαβές προϊόντων
- Αποστολές προϊόντων
- Υπολογισμό αποθέματος
- Απόθεμα ανά προϊόν και αποθήκη
- Dashboard με συνολικά στοιχεία
- Dashboard με στοιχεία ανά αποθήκη
- Ελληνικά και Αγγλικά
- Settings
- REST API
- Swagger / OpenAPI
- H2 database
- Unit tests και tests για controller / application
- Σύνδεση frontend και backend μέσω REST API

---

## 3. Τεχνολογίες που χρησιμοποίησα

### Backend

- Java 21
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- Spring Security
- BCrypt
- Maven
- H2 Database

### Frontend

- React
- TypeScript
- Vite
- HTML
- CSS
- React Hooks

### Testing

- JUnit
- Spring Boot Test
- Mockito

### API

- REST API
- Swagger / OpenAPI

---

## 4. Δομή του backend

Στο backend ακολούθησα layered αρχιτεκτονική.

Η βασική ροή είναι:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Τα βασικά packages είναι:

```
gr.warehouse
├── config
├── controller
├── model
├── repository
└── service
```

Στα `model` έχω τα entities, στα `repository` την επικοινωνία με τη βάση, στα `service` τη λογική της εφαρμογής και στα `controller` τα REST endpoints.

---

## 5. Backend

Το backend είναι Spring Boot εφαρμογή και τρέχει στη θύρα 8080.

Τα βασικά endpoints αφορούν:

```
/users
/products
/warehouses
/receipts
/shipments
/inventory
```

Χρησιμοποίησα GET, POST, PUT και DELETE όπου χρειάζεται.

---

## 6. Βάση δεδομένων

Για τη βάση χρησιμοποίησα H2.

Η βάση είναι file-based ώστε τα δεδομένα να μην χάνονται κάθε φορά που σταματάει η εφαρμογή.

```
jdbc:h2:file:./data/warehouse
```

Στη βάση αποθηκεύονται οι χρήστες, τα προϊόντα, οι αποθήκες, οι παραλαβές και οι αποστολές.

Το H2 Console βρίσκεται στο:

```
http://localhost:8080/h2-console
```

### Στοιχεία H2

```
Username: h2admin
Password: 1234
JDBC URL: jdbc:h2:file:./data/warehouse
```

---

## 7. Login και ασφάλεια

Έφτιαξα Register και Login για τους χρήστες της εφαρμογής.

Τα passwords δεν αποθηκεύονται στη βάση σε απλή μορφή. Πριν αποθηκευτούν χρησιμοποιείται `BCryptPasswordEncoder`.

Το Login ελέγχει το password που δίνει ο χρήστης με το κρυπτογραφημένο password που υπάρχει στη βάση.

Υπάρχει επίσης Logout από το frontend.

### Test user

Για δοκιμή έχω αφήσει έναν χρήστη:

```
Username: admin
Password: 1234
```

Αυτά είναι τα στοιχεία που μπορώ να χρησιμοποιήσω για να μπω στην εφαρμογή.

Το ίδιο username και password χρησιμοποιείται και για το Swagger.

---

## 8. Products

Στη σελίδα Products μπορώ να:

- δω τα προϊόντα
- προσθέσω προϊόν
- επεξεργαστώ προϊόν
- διαγράψω προϊόν

Κάθε προϊόν έχει στοιχεία όπως:

- Product ID
- Product code
- Product name
- Category
- Price
- Location

Το stock υπολογίζεται από τις παραλαβές και τις αποστολές.

```
Stock = Receipts - Shipments
```

Έτσι το διαθέσιμο απόθεμα βγαίνει από τις πραγματικές κινήσεις της αποθήκης.

---

## 9. Warehouses

Στη σελίδα Warehouses μπορώ να:

- δω τις αποθήκες
- προσθέσω αποθήκη
- επεξεργαστώ αποθήκη
- διαγράψω αποθήκη

Για κάθε αποθήκη κρατάω:

- Warehouse ID
- Code
- Name
- Address
- Capacity

Η σελίδα επικοινωνεί με το backend μέσω REST API.

---

## 10. Receipts

Στη σελίδα Receipts καταχωρώ τα προϊόντα που μπαίνουν στην αποθήκη.

Μια παραλαβή έχει:

- Receipt code
- Product
- Product code
- Quantity
- Warehouse
- Date

Μπορώ να κάνω:

- Create
- View
- Edit
- Delete

Κάθε παραλαβή αυξάνει το διαθέσιμο stock του συγκεκριμένου προϊόντος στην αντίστοιχη αποθήκη.

---

## 11. Shipments

Στη σελίδα Shipments καταχωρώ τα προϊόντα που φεύγουν από την αποθήκη.

Μια αποστολή έχει:

- Shipment code
- Product
- Quantity
- From warehouse
- Destination
- Date

Μπορώ επίσης να κάνω:

- Create
- View
- Edit
- Delete

Στην επιλογή προϊόντος εμφανίζεται το διαθέσιμο stock και γίνεται έλεγχος ώστε να μην μπορεί να γίνει αποστολή μεγαλύτερη από το διαθέσιμο απόθεμα.

Ο έλεγχος γίνεται με βάση τις παραλαβές και τις αποστολές .

---

## 12. Inventory

Η σελίδα Inventory είναι αυτή που δείχνει το πραγματικό απόθεμα.

Το βασικό που ακολουθώ είναι:

```
Stock = Receipts - Shipments
```

Το υπολογίζω ξεχωριστά για κάθε:

```
Product + Warehouse
```

Δηλαδή το ίδιο προϊόν μπορεί να υπάρχει σε περισσότερες από μία αποθήκες και να έχει διαφορετικό stock στην κάθε μία.

Για παράδειγμα:

```text
PRD-001 - Laptop

Κεντρική Αποθήκη → 289
ΑΠΟΘΗΚΗ 2       → 20

PRD-002 - Tablet

ΑΠΟΘΗΚΗ 2       → 10
```

Στον πίνακα Inventory εμφανίζω:

- Product code
- Product
- Category
- Warehouse
- Receipts
- Shipments
- Stock
- Location
- Status

Το status υπολογίζεται αυτόματα:

```
0 ή μικρότερο → Out of stock
1 έως 5       → Low stock
πάνω από 5    → Available
```

---

## 13. Dashboard

Στο Dashboard έβαλα μια συνοπτική εικόνα της αποθήκης.

Στο πάνω μέρος εμφανίζονται:

- Products
- Inventory
- Receipts
- Shipments

Τα Receipts και Shipments είναι το άθροισμα των ποσοτήτων και όχι ο αριθμός των εγγραφών.

Το συνολικό Inventory υπολογίζεται:

```
Total Inventory = Total Receipts - Total Shipments
```

Έβαλα επίσης ξεχωριστή ανάλυση για κάθε αποθήκη.

Για κάθε αποθήκη εμφανίζονται:

- Products
- Inventory
- Receipts
- Shipments

Οι αποθήκες υπολογίζονται δυναμικά, οπότε αν προστεθεί καινούρια αποθήκη μπορεί να εμφανιστεί και στο Dashboard.

---

## 14. Έλεγχος ότι τα στοιχεία συμφωνούν

Προσπάθησα τα στοιχεία του Dashboard, του Inventory και των Shipments να βασίζονται στην ίδια λογική.

Ο βασικός κανόνας είναι:

```
Stock = Receipts - Shipments
```

και για συγκεκριμένο προϊόν και αποθήκη:

```
Product + Warehouse Stock =
Product Receipts - Product Shipments
```

Έτσι το stock που βλέπω στις διαφορετικές σελίδες βγαίνει από τα ίδια δεδομένα.

---

## 15. Settings

Στο Settings έχω βάλει κάποιες βασικές πληροφορίες της εφαρμογής.

```
Warehouse
warehouse@demo.com
210 999 9999
```

Οι πληροφορίες αυτές εμφανίζονται μόνο για προβολή.

Από εκεί μπορώ επίσης να αλλάξω τη γλώσσα της εφαρμογής.

---

## 16. Ελληνικά και Αγγλικά

Έχω προσθέσει επιλογή για:

- Ελληνικά
- English

Η επιλογή της γλώσσας αποθηκεύεται στο browser ώστε να παραμένει και μετά από αλλαγή σελίδας ή refresh.

Η μετάφραση υπάρχει στις βασικές σελίδες:

- Dashboard
- Products
- Warehouses
- Receipts
- Shipments
- Inventory
- Settings
- Login
- Register

---

## 17. REST API

Το React frontend επικοινωνεί με το Spring Boot backend μέσω REST API.

Τα βασικά resources είναι:

```
/users
/products
/warehouses
/receipts
/shipments
/inventory
```

Η επικοινωνία γίνεται μέσω του backend στη θύρα 8080.

---

## 18. Swagger / OpenAPI

Πρόσθεσα Swagger / OpenAPI για την τεκμηρίωση και τον έλεγχο του REST API.

Το Swagger βρίσκεται στο:

```
http://localhost:8080/swagger-ui/index.html
```

### Swagger login

```text
Username: admin
Password: 1234
```

Το Swagger ζητάει username και password πριν ανοίξει.

Μέσα από το Swagger μπορώ να δω και να δοκιμάσω τα REST endpoints.

---

## 19. Frontend

Το frontend είναι φτιαγμένο με React, TypeScript και Vite.

Τρέχει στο:

```
http://localhost:5173
```

Οι βασικές σελίδες είναι:

```
Dashboard
Products
Warehouses
Receipts
Shipments
Inventory
Settings
```

Η πλοήγηση γίνεται από το menu της εφαρμογής.

---

## 20. Project Structure

Η βασική δομή του project είναι:

```
warehouse-management-system
│
├── backend
├── frontend
└── README.md


## 21. Tests

Έγραψα tests για τα βασικά services, το Warehouse controller και το application context.

Έχω tests για:

- ProductService
- ReceiptService
- ShipmentService
- UserService
- WarehouseService
- WarehouseController
- WarehouseApplication

Το τελευταίο πλήρες test run ήταν:

```
45 tests
0 failures
0 errors
0 skipped

BUILD SUCCESS
```

Τα tests τρέχουν με Maven.

Επειδή η H2 είναι file-based, όταν κάνω όλο το test suite σταματάω πρώτα το backend ώστε να μην είναι κλειδωμένο το αρχείο της βάσης.

---

## 22. Πώς τρέχω το backend

Ανοίγω το project στο IntelliJ IDEA και κάνω Run στο:

WarehouseApplication

Αυτό ξεκινάει το Spring Boot backend στη θύρα 8080.

Μετά ανοίγω το frontend και τρέχω το React application.

Για να λειτουργεί κανονικά όλη η εφαρμογή, πρέπει να τρέχουν και το backend και το frontend.

---

## 23. Πώς τρέχω το frontend

Ανοίγω δεύτερο terminal μέσα στον φάκελο `frontend`.

Αν χρειάζεται πρώτα εγκαθιστώ τα dependencies:

```bash
npm install
```

και μετά:

```bash
npm run dev
```

Το frontend ανοίγει στο:

```text
http://localhost:5173
```

---

## 24. Build και tests

Για το backend:

```bash
mvn clean test
```

Με αυτή την εντολή γίνεται clean, compile και εκτέλεση των tests.

Για το frontend:

```bash
npm install
npm run build
```

---

## 25. Διευθύνσεις που χρησιμοποιώ

### Εφαρμογή

```
http://localhost:5173
```

### Swagger

```
http://localhost:8080/swagger-ui/index.html
```

### H2 Console

```
http://localhost:8080/h2-console
```

### User εφαρμογής / Swagger

```
Username: admin
Password: 1234
```

### H2

```
Username: h2admin
Password: 1234
JDBC URL: jdbc:h2:file:./data/warehouse
```

---

## 26. Τι έχω αυτή τη στιγμή στη βάση

Με τα δεδομένα που έχω βάλει για δοκιμή:

```text
Products: 2

Total Receipts: 339
Total Shipments: 20
Total Inventory: 319

Warehouses: 2
```

### Κεντρική Αποθήκη

```
Receipts: 299
Shipments: 10
Stock: 289
```

### ΑΠΟΘΗΚΗ 2

```
Receipts: 40
Shipments: 10
Stock: 30
```

Ανά προϊόν:

```
PRD-001 Laptop
Κεντρική Αποθήκη → 289
ΑΠΟΘΗΚΗ 2       → 20

PRD-002 Tablet
ΑΠΟΘΗΚΗ 2       → 10
```

---

## 27. Πώς δούλεψα το project

Το project το έφτιαξα σταδιακά.

Ξεκίνησα από το backend και τα βασικά entities και στη συνέχεια πρόσθεσα repositories, services και controllers.

Μετά σύνδεσα τη βάση H2 και έφτιαξα το React frontend.

Στη συνέχεια πρόσθεσα τις σελίδες για Products, Warehouses, Receipts, Shipments και Inventory και σύνδεσα τις σελίδες με το backend.

Σημαντικό κομμάτι ήταν ο υπολογισμός του stock ώστε το πραγματικό stock να προκύπτει από τις παραλαβές μείον τις αποστολές.

Μετά πρόσθεσα τον υπολογισμό ανά αποθήκη, το Dashboard, τη γλώσσα Ελληνικά / Αγγλικά, τα Settings, το Swagger και τα tests.

Στο τέλος έκανα έλεγχο τόσο από το frontend όσο και από το Swagger και έτρεξα όλο το test suite.

---

## 28. Βασικός κανόνας του stock

Ο βασικός κανόνας που χρησιμοποιεί η εφαρμογή είναι:

```
CURRENT STOCK = RECEIPTS - SHIPMENTS
```

Για συγκεκριμένη αποθήκη:

```
WAREHOUSE STOCK =
RECEIPTS FOR THAT WAREHOUSE
-
SHIPMENTS FROM THAT WAREHOUSE
```

Για συγκεκριμένο προϊόν και αποθήκη:

```
PRODUCT + WAREHOUSE STOCK =
PRODUCT RECEIPTS IN WAREHOUSE
-
PRODUCT SHIPMENTS FROM WAREHOUSE
```

Αυτός ο κανόνας χρησιμοποιείται στο Inventory, στο Dashboard και στον έλεγχο των Shipments.

---

## 29. Τελικό αποτέλεσμα

Με το project προσπάθησα να καλύψω όλη τη βασική λειτουργία ενός μικρού Warehouse Management System.

Έχω ένα backend με Spring Boot, JPA, Services, Repositories και REST Controllers, βάση H2, authentication με Spring Security, frontend με React / TypeScript, REST επικοινωνία μεταξύ frontend και backend, Swagger και automated tests.

Το βασικό κομμάτι της εφαρμογής είναι ότι το stock δεν το αλλάζω χειροκίνητα. Προκύπτει από τις κινήσεις της αποθήκης, δηλαδή από τις παραλαβές και τις αποστολές.

---

## 30. Developer

**Ioannis Panagopoulos**

Coding Factory Final Project

**Warehouse Management System (WMS)**
