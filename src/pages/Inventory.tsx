import { useEffect, useState } from 'react'
import './Inventory.css'
import { useLanguage } from '../LanguageContext'

type Product = {
  id: number
  code: string
  name: string
  category: string
  price: number
  quantity: number
  location: string
}

type Receipt = {
  id: number
  receiptCode: string
  productId: number
  product: string
  quantity: number
  warehouse: string
  date: string
}

type Shipment = {
  id: number
  shipmentCode: string
  productId: number
  product: string
  quantity: number
  warehouse: string
  date: string
}

type InventoryRow = {
  product: Product
  warehouse: string
  receipts: number
  shipments: number
  stock: number
}

function Inventory() {
  const { language } = useLanguage()
  const isGreek = language === 'Ελληνικά'

  const [products, setProducts] = useState<Product[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = (): HeadersInit => {
    const auth = sessionStorage.getItem('auth')

    if (!auth) {
      return {}
    }

    return {
      Authorization: `Basic ${auth}`,
    }
  }

  const loadInventory = async () => {
    try {
      const authHeaders = getAuthHeaders()

      const [
        productsResponse,
        receiptsResponse,
        shipmentsResponse,
      ] = await Promise.all([
        fetch('http://localhost:8080/products', {
          headers: {
            ...authHeaders,
          },
        }),
        fetch('http://localhost:8080/receipts', {
          headers: {
            ...authHeaders,
          },
        }),
        fetch('http://localhost:8080/shipments', {
          headers: {
            ...authHeaders,
          },
        }),
      ])

      if (!productsResponse.ok) {
        throw new Error('Failed to load products')
      }

      if (!receiptsResponse.ok) {
        throw new Error('Failed to load receipts')
      }

      if (!shipmentsResponse.ok) {
        throw new Error('Failed to load shipments')
      }

      const productsData = await productsResponse.json()
      const receiptsData = await receiptsResponse.json()
      const shipmentsData = await shipmentsResponse.json()

      setProducts(productsData)
      setReceipts(receiptsData)
      setShipments(shipmentsData)
    } catch (error) {
      console.error('Error loading inventory:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η φόρτωση του αποθέματος.'
          : 'Inventory could not be loaded.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  /*
   * Δημιουργούμε μία γραμμή αποθέματος
   * για κάθε προϊόν και κάθε αποθήκη.
   *
   * Απόθεμα ανά αποθήκη =
   * Παραλαβές ανά αποθήκη - Αποστολές ανά αποθήκη
   */

  const inventoryRows: InventoryRow[] = []

  products.forEach((product) => {
    const productReceipts = receipts.filter(
      (receipt) =>
        receipt.productId === product.id
    )

    const productShipments = shipments.filter(
      (shipment) =>
        shipment.productId === product.id
    )

    const warehouseNames = new Set<string>()

    productReceipts.forEach((receipt) => {
      if (receipt.warehouse) {
        warehouseNames.add(receipt.warehouse)
      }
    })

    productShipments.forEach((shipment) => {
      if (shipment.warehouse) {
        warehouseNames.add(shipment.warehouse)
      }
    })

    Array.from(warehouseNames).forEach(
      (warehouse) => {
        const warehouseReceipts =
          productReceipts
            .filter(
              (receipt) =>
                receipt.warehouse === warehouse
            )
            .reduce(
              (total, receipt) =>
                total + receipt.quantity,
              0
            )

        const warehouseShipments =
          productShipments
            .filter(
              (shipment) =>
                shipment.warehouse === warehouse
            )
            .reduce(
              (total, shipment) =>
                total + shipment.quantity,
              0
            )

        const stock =
          warehouseReceipts -
          warehouseShipments

        inventoryRows.push({
          product,
          warehouse,
          receipts: warehouseReceipts,
          shipments: warehouseShipments,
          stock,
        })
      }
    )
  })

  /*
   * Συνολικό απόθεμα όλων των προϊόντων
   * και όλων των αποθηκών.
   */
  const totalQuantity = inventoryRows.reduce(
    (total, row) =>
      total + row.stock,
    0
  )

  /*
   * Οι συνολικές αποθήκες που υπάρχουν
   * στις κινήσεις της εφαρμογής.
   */
  const warehouses = new Set([
    ...receipts.map(
      (receipt) => receipt.warehouse
    ),
    ...shipments.map(
      (shipment) => shipment.warehouse
    ),
  ])

  return (
    <div className="inventory-page">

      <div className="inventory-header">
        <div>
          <h1>
            {isGreek ? 'Απόθεμα' : 'Inventory'}
          </h1>

          <p>
            {isGreek
              ? 'Έλεγχος και παρακολούθηση αποθέματος'
              : 'Inventory monitoring and tracking'}
          </p>
        </div>
      </div>

      <div className="inventory-summary">

        <div className="inventory-card">
          <h3>
            {isGreek
              ? 'Σύνολο προϊόντων'
              : 'Total products'}
          </h3>

          <span>
            {products.length}
          </span>
        </div>

        <div className="inventory-card">
          <h3>
            {isGreek
              ? 'Συνολική ποσότητα'
              : 'Total quantity'}
          </h3>

          <span>
            {totalQuantity}
          </span>
        </div>

        <div className="inventory-card">
          <h3>
            {isGreek
              ? 'Αποθήκες'
              : 'Warehouses'}
          </h3>

          <span>
            {warehouses.size}
          </span>
        </div>

      </div>

      <div className="inventory-table-container">

        <table className="inventory-table">

          <thead>
            <tr>

              <th>
                {isGreek ? 'Κωδικός' : 'Code'}
              </th>

              <th>
                {isGreek ? 'Προϊόν' : 'Product'}
              </th>

              <th>
                {isGreek
                  ? 'Κατηγορία'
                  : 'Category'}
              </th>

              <th>
                {isGreek
                  ? 'Αποθήκη'
                  : 'Warehouse'}
              </th>

              <th>
                {isGreek
                  ? 'Παραλαβές'
                  : 'Receipts'}
              </th>

              <th>
                {isGreek
                  ? 'Αποστολές'
                  : 'Shipments'}
              </th>

              <th>
                {isGreek
                  ? 'Απόθεμα'
                  : 'Stock'}
              </th>

              <th>
                {isGreek
                  ? 'Θέση'
                  : 'Location'}
              </th>

              <th>
                {isGreek
                  ? 'Κατάσταση'
                  : 'Status'}
              </th>

            </tr>
          </thead>

          <tbody>

            {inventoryRows.map(
              (row, index) => {

                const product =
                  row.product

                return (
                  <tr
                    key={`${product.id}-${row.warehouse}-${index}`}
                  >

                    <td>
                      {product.code}
                    </td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      {row.warehouse}
                    </td>

                    <td>
                      {row.receipts}
                    </td>

                    <td>
                      {row.shipments}
                    </td>

                    <td>
                      <strong>
                        {row.stock}
                      </strong>
                    </td>

                    <td>
                      {product.location}
                    </td>

                    <td>

                      {row.stock <= 0 ? (

                        <span className="stock-low">
                          {isGreek
                            ? 'Εξαντλημένο'
                            : 'Out of stock'}
                        </span>

                      ) : row.stock <= 5 ? (

                        <span className="stock-low">
                          {isGreek
                            ? 'Χαμηλό απόθεμα'
                            : 'Low stock'}
                        </span>

                      ) : (

                        <span className="stock-ok">
                          {isGreek
                            ? 'Διαθέσιμο'
                            : 'Available'}
                        </span>

                      )}

                    </td>

                  </tr>
                )
              }
            )}

            {!loading &&
              products.length === 0 && (
                <tr>

                  <td
                    colSpan={9}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    {isGreek
                      ? 'Δεν υπάρχουν προϊόντα.'
                      : 'No products found.'}
                  </td>

                </tr>
              )}

            {!loading &&
              products.length > 0 &&
              inventoryRows.length === 0 && (
                <tr>

                  <td
                    colSpan={9}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    {isGreek
                      ? 'Δεν υπάρχουν κινήσεις αποθέματος.'
                      : 'No inventory movements found.'}
                  </td>

                </tr>
              )}

            {loading && (
              <tr>

                <td
                  colSpan={9}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  {isGreek
                    ? 'Φόρτωση αποθέματος...'
                    : 'Loading inventory...'}
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Inventory