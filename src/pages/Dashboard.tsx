import { useEffect, useState } from 'react'
import './Dashboard.css'
import { useLanguage } from '../LanguageContext'

type Product = {
  id?: number
  code: string
  name: string
  category: string
  price: number
  quantity: number
  location: string
}

type Receipt = {
  id: number
  productId: number
  quantity: number
  warehouse: string
}

type Shipment = {
  id: number
  productId: number
  quantity: number
  warehouse: string
}

function Dashboard() {
  const { language } = useLanguage()

  const isGreek = language === 'Ελληνικά'

  const [products, setProducts] = useState<Product[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])

  const getAuthHeaders = (): HeadersInit => {
    const auth = sessionStorage.getItem('auth')

    if (!auth) {
      return {}
    }

    return {
      Authorization: `Basic ${auth}`,
    }
  }

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  /*
   * Συνολικό απόθεμα:
   *
   * Παραλαβές - Αποστολές
   *
   * Δεν χρησιμοποιούμε το product.quantity.
   */

  const totalQuantity = products.reduce((total, product) => {
    const totalReceipts = receipts
      .filter(
        (receipt) =>
          receipt.productId === product.id
      )
      .reduce(
        (sum, receipt) =>
          sum + receipt.quantity,
        0
      )

    const totalShipments = shipments
      .filter(
        (shipment) =>
          shipment.productId === product.id
      )
      .reduce(
        (sum, shipment) =>
          sum + shipment.quantity,
        0
      )

    const stock =
      totalReceipts - totalShipments

    return total + stock
  }, 0)

  /*
   * Συνολικές ποσότητες παραλαβών
   * από όλες τις αποθήκες.
   */

  const totalReceipts = receipts.reduce(
    (total, receipt) =>
      total + receipt.quantity,
    0
  )

  /*
   * Συνολικές ποσότητες αποστολών
   * από όλες τις αποθήκες.
   */

  const totalShipments = shipments.reduce(
    (total, shipment) =>
      total + shipment.quantity,
    0
  )

  /*
   * Βρίσκουμε όλες τις αποθήκες που υπάρχουν
   * στις παραλαβές και στις αποστολές.
   *
   * Αν προστεθεί νέα αποθήκη στο μέλλον,
   * θα εμφανιστεί αυτόματα στο Dashboard.
   */

  const warehouseNames = Array.from(
    new Set([
      ...receipts
        .map(
          (receipt) =>
            receipt.warehouse
        )
        .filter(Boolean),

      ...shipments
        .map(
          (shipment) =>
            shipment.warehouse
        )
        .filter(Boolean),
    ])
  )

  /*
   * Δημιουργούμε τα στοιχεία κάθε αποθήκης.
   */

  const warehouseData = warehouseNames.map(
    (warehouse) => {

      const warehouseReceipts =
        receipts.filter(
          (receipt) =>
            receipt.warehouse === warehouse
        )

      const warehouseShipments =
        shipments.filter(
          (shipment) =>
            shipment.warehouse === warehouse
        )

      /*
       * Υπολογίζουμε πόσα διαφορετικά προϊόντα
       * έχουν κίνηση στη συγκεκριμένη αποθήκη.
       */

      const warehouseProductIds =
        new Set<number>()

      warehouseReceipts.forEach(
        (receipt) => {
          warehouseProductIds.add(
            receipt.productId
          )
        }
      )

      warehouseShipments.forEach(
        (shipment) => {
          warehouseProductIds.add(
            shipment.productId
          )
        }
      )

      const productCount =
        warehouseProductIds.size

      /*
       * Συνολικές παραλαβές της αποθήκης.
       */

      const totalWarehouseReceipts =
        warehouseReceipts.reduce(
          (total, receipt) =>
            total + receipt.quantity,
          0
        )

      /*
       * Συνολικές αποστολές της αποθήκης.
       */

      const totalWarehouseShipments =
        warehouseShipments.reduce(
          (total, shipment) =>
            total + shipment.quantity,
          0
        )

      /*
       * Πραγματικό απόθεμα αποθήκης:
       *
       * Παραλαβές - Αποστολές
       */

      const warehouseStock =
        totalWarehouseReceipts -
        totalWarehouseShipments

      return {
        warehouse,
        productCount,
        receipts:
          totalWarehouseReceipts,
        shipments:
          totalWarehouseShipments,
        stock:
          warehouseStock,
      }
    }
  )

  return (
    <div className="dashboard">

      <h1>
        Warehouse Management System
      </h1>

      <p>
        {isGreek
          ? 'Καλώς ήρθατε στο σύστημα διαχείρισης αποθήκης.'
          : 'Welcome to the warehouse management system.'}
      </p>

      {/* =========================
          ΣΥΝΟΛΙΚΗ ΕΙΚΟΝΑ
         ========================= */}

      <div
        style={{
          marginTop: '28px',
        }}
      >

        <h2
          style={{
            marginBottom: '16px',
          }}
        >
          {isGreek
            ? 'Συνολική Εικόνα'
            : 'Overall Summary'}
        </h2>

        <div className="dashboard-cards">

          <div className="dashboard-card">

            <h2>
              {isGreek
                ? 'Προϊόντα'
                : 'Products'}
            </h2>

            <span>
              {products.length}
            </span>

          </div>

          <div className="dashboard-card">

            <h2>
              {isGreek
                ? 'Απόθεμα'
                : 'Inventory'}
            </h2>

            <span>
              {totalQuantity}
            </span>

          </div>

          <div className="dashboard-card">

            <h2>
              {isGreek
                ? 'Παραλαβές'
                : 'Receipts'}
            </h2>

            <span>
              {totalReceipts}
            </span>

          </div>

          <div className="dashboard-card">

            <h2>
              {isGreek
                ? 'Αποστολές'
                : 'Shipments'}
            </h2>

            <span>
              {totalShipments}
            </span>

          </div>

        </div>

      </div>

      {/* =========================
          ΧΩΡΙΣΜΑ ΑΠΟΘΗΚΩΝ
         ========================= */}

      <div
        style={{
          marginTop: '36px',
          borderTop: '1px solid #d9dee5',
          paddingTop: '28px',
        }}
      >

        <h2
          style={{
            marginBottom: '6px',
          }}
        >
          {isGreek
            ? 'Ανάλυση ανά Αποθήκη'
            : 'Warehouse Breakdown'}
        </h2>

        <p
          style={{
            marginTop: 0,
            marginBottom: '24px',
          }}
        >
          {isGreek
            ? 'Απόθεμα και κινήσεις ανά αποθήκη'
            : 'Stock and movements per warehouse'}
        </p>

        {/* =========================
            ΚΑΘΕ ΑΠΟΘΗΚΗ
           ========================= */}

        {warehouseData.map(
          (warehouse, index) => (

            <div
              key={warehouse.warehouse}
              style={{
                marginBottom: '28px',
                background: '#f8f9fb',
                border: '1px solid #e1e5ea',
                borderRadius: '14px',
                padding: '20px',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: '18px',
                }}
              >
                {isGreek
                  ? `Αποθήκη ${index + 1} — ${warehouse.warehouse}`
                  : `Warehouse ${index + 1} — ${warehouse.warehouse}`}
              </h2>

              <div className="dashboard-cards">

                <div className="dashboard-card">

                  <h2>
                    {isGreek
                      ? 'Προϊόντα'
                      : 'Products'}
                  </h2>

                  <span>
                    {warehouse.productCount}
                  </span>

                </div>

                <div className="dashboard-card">

                  <h2>
                    {isGreek
                      ? 'Απόθεμα'
                      : 'Inventory'}
                  </h2>

                  <span>
                    {warehouse.stock}
                  </span>

                </div>

                <div className="dashboard-card">

                  <h2>
                    {isGreek
                      ? 'Παραλαβές'
                      : 'Receipts'}
                  </h2>

                  <span>
                    {warehouse.receipts}
                  </span>

                </div>

                <div className="dashboard-card">

                  <h2>
                    {isGreek
                      ? 'Αποστολές'
                      : 'Shipments'}
                  </h2>

                  <span>
                    {warehouse.shipments}
                  </span>

                </div>

              </div>

            </div>

          )
        )}

        {warehouseData.length === 0 && (

          <div className="dashboard-card">

            <h2>
              {isGreek
                ? 'Δεν υπάρχουν διαθέσιμες αποθήκες'
                : 'No warehouses available'}
            </h2>

            <span>
              0
            </span>

          </div>

        )}

      </div>

    </div>
  )
}

export default Dashboard