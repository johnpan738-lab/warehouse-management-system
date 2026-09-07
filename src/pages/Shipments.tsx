import { useEffect, useState } from 'react'
import './Shipments.css'
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

type Warehouse = {
  id: number
  code: string
  name: string
  address: string
  capacity: number
}

type Shipment = {
  id: number
  shipmentCode: string
  productId: number
  product: string
  quantity: number
  warehouse: string
  destination: string
  date: string
}

function Shipments() {
  const { language } = useLanguage()
  const isGreek = language === 'Ελληνικά'

  const [showForm, setShowForm] = useState(false)

  const [shipments, setShipments] = useState<Shipment[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const [shipmentCode, setShipmentCode] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [warehouse, setWarehouse] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)

  const getAuthHeaders = (): HeadersInit => {
    const auth = sessionStorage.getItem('auth')

    if (!auth) {
      return {}
    }

    return {
      Authorization: `Basic ${auth}`,
    }
  }

  const loadShipments = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/shipments',
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load shipments')
      }

      const data = await response.json()
      setShipments(data)
    } catch (error) {
      console.error('Error loading shipments:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η φόρτωση των αποστολών.'
          : 'Shipments could not be loaded.'
      )
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/products',
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η φόρτωση των προϊόντων.'
          : 'Products could not be loaded.'
      )
    }
  }

  const loadReceipts = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/receipts',
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load receipts')
      }

      const data = await response.json()
      setReceipts(data)
    } catch (error) {
      console.error('Error loading receipts:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η φόρτωση των παραλαβών.'
          : 'Receipts could not be loaded.'
      )
    }
  }

  const loadWarehouses = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/warehouses',
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load warehouses')
      }

      const data = await response.json()
      setWarehouses(data)
    } catch (error) {
      console.error('Error loading warehouses:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η φόρτωση των αποθηκών.'
          : 'Warehouses could not be loaded.'
      )
    }
  }

  useEffect(() => {
    loadShipments()
    loadProducts()
    loadReceipts()
    loadWarehouses()
  }, [])

  const getProductStock = (productId: number) => {
    const totalReceipts = receipts
      .filter(
        (receipt) =>
          receipt.productId === productId
      )
      .reduce(
        (total, receipt) =>
          total + receipt.quantity,
        0
      )

    const totalShipments = shipments
      .filter(
        (shipment) =>
          shipment.productId === productId
      )
      .reduce(
        (total, shipment) =>
          total + shipment.quantity,
        0
      )

    return totalReceipts - totalShipments
  }

  const clearForm = () => {
    setShipmentCode('')
    setProductId('')
    setQuantity('')
    setWarehouse('')
    setDestination('')
    setDate('')
    setEditingId(null)
  }

  const openNewShipmentForm = () => {
    clearForm()
    setShowForm(true)
  }

  const openEditForm = (shipment: Shipment) => {
    setEditingId(shipment.id)

    setShipmentCode(shipment.shipmentCode)
    setProductId(String(shipment.productId))
    setQuantity(String(shipment.quantity))
    setWarehouse(shipment.warehouse)
    setDestination(shipment.destination)
    setDate(shipment.date)

    setShowForm(true)
  }

  const handleSave = async () => {
    if (
      !shipmentCode.trim() ||
      !productId ||
      !quantity ||
      !warehouse ||
      !destination.trim() ||
      !date
    ) {
      alert(
        isGreek
          ? 'Συμπλήρωσε όλα τα πεδία.'
          : 'Please fill in all fields.'
      )

      return
    }

    const selectedProduct = products.find(
      (product) =>
        product.id === Number(productId)
    )

    if (!selectedProduct) {
      alert(
        isGreek
          ? 'Επίλεξε ένα έγκυρο προϊόν.'
          : 'Please select a valid product.'
      )

      return
    }

    const selectedWarehouse = warehouses.find(
      (item) => item.name === warehouse
    )

    if (!selectedWarehouse) {
      alert(
        isGreek
          ? 'Επίλεξε μια έγκυρη αποθήκη.'
          : 'Please select a valid warehouse.'
      )

      return
    }

    const shipmentQuantity = Number(quantity)

    if (shipmentQuantity <= 0) {
      alert(
        isGreek
          ? 'Η ποσότητα πρέπει να είναι μεγαλύτερη από 0.'
          : 'Quantity must be greater than 0.'
      )

      return
    }

    /*
     * Στο Edit, το υπάρχον shipment δεν πρέπει
     * να μετράει ως δεσμευμένο απόθεμα στον έλεγχο.
     */
    let availableStock = getProductStock(
      selectedProduct.id
    )

    if (editingId !== null) {
      const existingShipment = shipments.find(
        (shipment) =>
          shipment.id === editingId
      )

      if (
        existingShipment &&
        existingShipment.productId === selectedProduct.id
      ) {
        availableStock += existingShipment.quantity
      }
    }

    if (availableStock < shipmentQuantity) {
      alert(
        isGreek
          ? `Δεν υπάρχει αρκετό απόθεμα. Διαθέσιμη ποσότητα: ${availableStock}`
          : `Not enough stock. Available quantity: ${availableStock}`
      )

      return
    }

    const shipmentData = {
      shipmentCode: shipmentCode.trim(),
      productId: Number(productId),
      product: selectedProduct.name,
      quantity: shipmentQuantity,
      warehouse: selectedWarehouse.name,
      destination: destination.trim(),
      date,
    }

    try {
      let response: Response

      if (editingId !== null) {
        response = await fetch(
          `http://localhost:8080/shipments/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(shipmentData),
          }
        )
      } else {
        response = await fetch(
          'http://localhost:8080/shipments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(shipmentData),
          }
        )
      }

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          errorText || 'Failed to save shipment'
        )
      }

      await loadShipments()
      await loadProducts()
      await loadReceipts()

      clearForm()
      setShowForm(false)

      alert(
        isGreek
          ? editingId !== null
            ? 'Η αποστολή ενημερώθηκε επιτυχώς.'
            : 'Η αποστολή αποθηκεύτηκε επιτυχώς.'
          : editingId !== null
            ? 'Shipment updated successfully.'
            : 'Shipment saved successfully.'
      )
    } catch (error) {
      console.error('Error saving shipment:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η αποθήκευση της αποστολής.'
          : 'Shipment could not be saved.'
      )
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      isGreek
        ? 'Θέλεις σίγουρα να διαγράψεις αυτή την αποστολή;'
        : 'Are you sure you want to delete this shipment?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/shipments/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete shipment')
      }

      await loadShipments()
      await loadProducts()
      await loadReceipts()

      alert(
        isGreek
          ? 'Η αποστολή διαγράφηκε.'
          : 'Shipment deleted.'
      )
    } catch (error) {
      console.error('Error deleting shipment:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η διαγραφή της αποστολής.'
          : 'Shipment could not be deleted.'
      )
    }
  }

  return (
    <div className="shipments-page">

      <div className="shipments-header">

        <div>
          <h1>
            {isGreek ? 'Αποστολές' : 'Shipments'}
          </h1>

          <p>
            {isGreek
              ? 'Διαχείριση αποστολών προϊόντων'
              : 'Manage product shipments'}
          </p>
        </div>

        <button
          className="add-shipment-button"
          onClick={openNewShipmentForm}
        >
          + {isGreek ? 'Νέα αποστολή' : 'New shipment'}
        </button>

      </div>

      {showForm && (
        <div className="shipment-form-container">

          <div className="shipment-form">

            <div className="form-header">

              <h2>
                {editingId !== null
                  ? isGreek
                    ? 'Επεξεργασία αποστολής'
                    : 'Edit shipment'
                  : isGreek
                    ? 'Νέα αποστολή'
                    : 'New shipment'}
              </h2>

              <button
                className="close-button"
                onClick={() => {
                  clearForm()
                  setShowForm(false)
                }}
              >
                ✕
              </button>

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Κωδικός αποστολής'
                  : 'Shipment code'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. SHP-002'
                    : 'e.g. SHP-002'
                }
                value={shipmentCode}
                onChange={(e) =>
                  setShipmentCode(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek ? 'Προϊόν' : 'Product'}
              </label>

              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
              >

                <option value="">
                  {isGreek
                    ? '-- Επίλεξε προϊόν --'
                    : '-- Select product --'}
                </option>

                {products.map((product) => {

                  let stock = getProductStock(
                    product.id
                  )

                  if (editingId !== null) {
                    const existingShipment =
                      shipments.find(
                        (shipment) =>
                          shipment.id === editingId
                      )

                    if (
                      existingShipment &&
                      existingShipment.productId ===
                        product.id
                    ) {
                      stock +=
                        existingShipment.quantity
                    }
                  }

                  return (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.code} - {product.name} (
                      {isGreek
                        ? 'απόθεμα'
                        : 'stock'}
                      : {stock})
                    </option>
                  )
                })}

              </select>

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Ποσότητα'
                  : 'Quantity'}
              </label>

              <input
                type="number"
                min="1"
                placeholder={
                  isGreek
                    ? 'π.χ. 10'
                    : 'e.g. 10'
                }
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Από αποθήκη'
                  : 'From warehouse'}
              </label>

              <select
                value={warehouse}
                onChange={(e) =>
                  setWarehouse(e.target.value)
                }
              >

                <option value="">
                  {isGreek
                    ? '-- Επίλεξε αποθήκη --'
                    : '-- Select warehouse --'}
                </option>

                {warehouses.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.code} - {item.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Προορισμός'
                  : 'Destination'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. Αθήνα'
                    : 'e.g. Athens'
                }
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Ημερομηνία'
                  : 'Date'}
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>

            <div className="form-actions">

              <button
                className="cancel-button"
                onClick={() => {
                  clearForm()
                  setShowForm(false)
                }}
              >
                {isGreek
                  ? 'Ακύρωση'
                  : 'Cancel'}
              </button>

              <button
                className="save-button"
                onClick={handleSave}
              >
                {isGreek
                  ? editingId !== null
                    ? 'Ενημέρωση'
                    : 'Αποθήκευση'
                  : editingId !== null
                    ? 'Update'
                    : 'Save'}
              </button>

            </div>

          </div>

        </div>
      )}

      <div className="shipments-table-container">

        <table className="shipments-table">

          <thead>

            <tr>

              <th>
                {isGreek
                  ? 'Κωδικός'
                  : 'Code'}
              </th>

              <th>
                {isGreek
                  ? 'Προϊόν'
                  : 'Product'}
              </th>

              <th>
                {isGreek
                  ? 'Ποσότητα'
                  : 'Quantity'}
              </th>

              <th>
                {isGreek
                  ? 'Από αποθήκη'
                  : 'From warehouse'}
              </th>

              <th>
                {isGreek
                  ? 'Προορισμός'
                  : 'Destination'}
              </th>

              <th>
                {isGreek
                  ? 'Ημερομηνία'
                  : 'Date'}
              </th>

              <th>
                {isGreek
                  ? 'Ενέργειες'
                  : 'Actions'}
              </th>

            </tr>

          </thead>

          <tbody>

            {shipments.map((shipment) => (

              <tr key={shipment.id}>

                <td>
                  {shipment.shipmentCode}
                </td>

                <td>
                  {shipment.product}
                </td>

                <td>
                  {shipment.quantity}
                </td>

                <td>
                  {shipment.warehouse}
                </td>

                <td>
                  {shipment.destination}
                </td>

                <td>
                  {shipment.date}
                </td>

                <td>

                  <button
                    className="action-button"
                    onClick={() =>
                      openEditForm(shipment)
                    }
                  >
                    {isGreek
                      ? 'Επεξεργασία'
                      : 'Edit'}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(shipment.id)
                    }
                  >
                    {isGreek
                      ? 'Διαγραφή'
                      : 'Delete'}
                  </button>

                </td>

              </tr>

            ))}

            {shipments.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  style={{
                    textAlign: 'center',
                  }}
                >
                  {isGreek
                    ? 'Δεν υπάρχουν αποστολές.'
                    : 'No shipments found.'}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Shipments