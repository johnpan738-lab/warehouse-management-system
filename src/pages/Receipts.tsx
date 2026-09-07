import { useEffect, useState } from 'react'
import './Receipts.css'
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

type Warehouse = {
  id: number
  code: string
  name: string
  address: string
  capacity: number
}

type Receipt = {
  id: number
  receiptCode: string
  productId: number
  productCode: string
  product: string
  quantity: number
  warehouse: string
  date: string
}

function Receipts() {
  const { language } = useLanguage()
  const isGreek = language === 'Ελληνικά'

  const [showForm, setShowForm] = useState(false)

  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const [receiptCode, setReceiptCode] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [warehouse, setWarehouse] = useState('')
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
    loadReceipts()
    loadProducts()
    loadWarehouses()
  }, [])

  const clearForm = () => {
    setReceiptCode('')
    setProductId('')
    setQuantity('')
    setWarehouse('')
    setDate('')
    setEditingId(null)
  }

  const openNewReceiptForm = () => {
    clearForm()
    setShowForm(true)
  }

  const openEditForm = (receipt: Receipt) => {
    setEditingId(receipt.id)

    setReceiptCode(receipt.receiptCode)
    setProductId(String(receipt.productId))
    setQuantity(String(receipt.quantity))
    setWarehouse(receipt.warehouse)
    setDate(receipt.date)

    setShowForm(true)
  }

  const handleSave = async () => {
    if (
      !receiptCode.trim() ||
      !productId ||
      !quantity ||
      !warehouse ||
      !date
    ) {
      alert(
        isGreek
          ? 'Συμπλήρωσε όλα τα πεδία.'
          : 'Please fill in all fields.'
      )

      return
    }

    const quantityNumber = Number(quantity)

    if (quantityNumber <= 0) {
      alert(
        isGreek
          ? 'Η ποσότητα πρέπει να είναι μεγαλύτερη από 0.'
          : 'Quantity must be greater than 0.'
      )

      return
    }

    const selectedProduct = products.find(
      (product) => product.id === Number(productId)
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

    const receiptData = {
      receiptCode: receiptCode.trim(),
      productId: Number(productId),
      productCode: selectedProduct.code,
      product: selectedProduct.name,
      quantity: quantityNumber,
      warehouse: selectedWarehouse.name,
      date,
    }

    try {
      let response: Response

      if (editingId !== null) {
        response = await fetch(
          `http://localhost:8080/receipts/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(receiptData),
          }
        )
      } else {
        response = await fetch(
          'http://localhost:8080/receipts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(receiptData),
          }
        )
      }

      if (!response.ok) {
        throw new Error('Failed to save receipt')
      }

      await loadReceipts()
      await loadProducts()

      clearForm()
      setShowForm(false)

      alert(
        isGreek
          ? editingId !== null
            ? 'Η παραλαβή ενημερώθηκε επιτυχώς.'
            : 'Η παραλαβή αποθηκεύτηκε επιτυχώς.'
          : editingId !== null
            ? 'Receipt updated successfully.'
            : 'Receipt saved successfully.'
      )
    } catch (error) {
      console.error('Error saving receipt:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η αποθήκευση της παραλαβής.'
          : 'The receipt could not be saved.'
      )
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      isGreek
        ? 'Θέλεις σίγουρα να διαγράψεις αυτή την παραλαβή;'
        : 'Are you sure you want to delete this receipt?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/receipts/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete receipt')
      }

      await loadReceipts()
      await loadProducts()

      alert(
        isGreek
          ? 'Η παραλαβή διαγράφηκε.'
          : 'Receipt deleted successfully.'
      )
    } catch (error) {
      console.error('Error deleting receipt:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η διαγραφή της παραλαβής.'
          : 'The receipt could not be deleted.'
      )
    }
  }

  return (
    <div className="receipts-page">

      <div className="receipts-header">

        <div>
          <h1>
            {isGreek ? 'Παραλαβές' : 'Receipts'}
          </h1>

          <p>
            {isGreek
              ? 'Διαχείριση παραλαβών προϊόντων'
              : 'Product receipt management'}
          </p>
        </div>

        <button
          className="add-receipt-button"
          onClick={openNewReceiptForm}
        >
          + {isGreek ? 'Νέα παραλαβή' : 'New receipt'}
        </button>

      </div>

      {showForm && (
        <div className="receipt-form-container">

          <div className="receipt-form">

            <div className="form-header">

              <h2>
                {editingId !== null
                  ? isGreek
                    ? 'Επεξεργασία παραλαβής'
                    : 'Edit receipt'
                  : isGreek
                    ? 'Νέα παραλαβή'
                    : 'New receipt'}
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
                  ? 'Κωδικός παραλαβής'
                  : 'Receipt code'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. REC-002'
                    : 'e.g. REC-002'
                }
                value={receiptCode}
                onChange={(e) =>
                  setReceiptCode(e.target.value)
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

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.code} - {product.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>
                {isGreek ? 'Ποσότητα' : 'Quantity'}
              </label>

              <input
                type="number"
                min="1"
                placeholder={
                  isGreek
                    ? 'π.χ. 20'
                    : 'e.g. 20'
                }
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek ? 'Αποθήκη' : 'Warehouse'}
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
                {isGreek ? 'Ημερομηνία' : 'Date'}
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
                {isGreek ? 'Ακύρωση' : 'Cancel'}
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

      <div className="receipts-table-container">

        <table className="receipts-table">

          <thead>

            <tr>

              <th>
                {isGreek
                  ? 'Κωδικός παραλαβής'
                  : 'Receipt code'}
              </th>

              <th>
                {isGreek
                  ? 'Κωδικός προϊόντος'
                  : 'Product code'}
              </th>

              <th>
                {isGreek ? 'Προϊόν' : 'Product'}
              </th>

              <th>
                {isGreek ? 'Ποσότητα' : 'Quantity'}
              </th>

              <th>
                {isGreek ? 'Αποθήκη' : 'Warehouse'}
              </th>

              <th>
                {isGreek ? 'Ημερομηνία' : 'Date'}
              </th>

              <th>
                {isGreek ? 'Ενέργειες' : 'Actions'}
              </th>

            </tr>

          </thead>

          <tbody>

            {receipts.map((receipt) => (

              <tr key={receipt.id}>

                <td>
                  {receipt.receiptCode}
                </td>

                <td>
                  {receipt.productCode}
                </td>

                <td>
                  {receipt.product}
                </td>

                <td>
                  {receipt.quantity}
                </td>

                <td>
                  {receipt.warehouse}
                </td>

                <td>
                  {receipt.date}
                </td>

                <td>

                  <button
                    className="action-button"
                    onClick={() =>
                      openEditForm(receipt)
                    }
                  >
                    {isGreek
                      ? 'Επεξεργασία'
                      : 'Edit'}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(receipt.id)
                    }
                  >
                    {isGreek
                      ? 'Διαγραφή'
                      : 'Delete'}
                  </button>

                </td>

              </tr>

            ))}

            {receipts.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  style={{ textAlign: 'center' }}
                >
                  {isGreek
                    ? 'Δεν υπάρχουν παραλαβές.'
                    : 'No receipts found.'}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Receipts