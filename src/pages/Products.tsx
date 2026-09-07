import { useEffect, useState } from 'react'
import './Products.css'
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

function Products() {
  const { language } = useLanguage()

  const isGreek = language === 'Ελληνικά'

  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')

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

  useEffect(() => {
    loadProducts()
  }, [])

  const openNewProductForm = () => {
    setEditingId(null)

    setCode('')
    setName('')
    setCategory('')
    setPrice('')
    setLocation('')

    setShowForm(true)
  }

  const openEditForm = (product: Product) => {
    setEditingId(product.id ?? null)

    setCode(product.code)
    setName(product.name)
    setCategory(product.category)
    setPrice(String(product.price))
    setLocation(product.location)

    setShowForm(true)
  }

  const handleSave = async () => {
    if (
      !code.trim() ||
      !name.trim() ||
      !category.trim() ||
      !price ||
      !location.trim()
    ) {
      alert(
        isGreek
          ? 'Συμπλήρωσε όλα τα πεδία.'
          : 'Please fill in all fields.'
      )

      return
    }

    const existingProduct = products.find(
      (product) => product.id === editingId
    )

    /*
     * Η ποσότητα δεν αποτελεί πλέον πεδίο του προϊόντος
     * στη φόρμα και δεν εμφανίζεται στον χρήστη.
     *
     * Για συμβατότητα με το υπάρχον backend:
     * - νέο προϊόν ξεκινάει με quantity = 0
     * - επεξεργασία κρατάει την υπάρχουσα quantity
     *
     * Η πραγματική μεταβολή του αποθέματος γίνεται
     * μέσω Παραλαβών και Αποστολών.
     */
    const productData = {
      code: code.trim(),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity:
        editingId !== null && existingProduct
          ? existingProduct.quantity
          : 0,
      location: location.trim(),
    }

    try {
      let response: Response

      if (editingId !== null) {
        response = await fetch(
          `http://localhost:8080/products/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(productData),
          }
        )
      } else {
        response = await fetch(
          'http://localhost:8080/products',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(productData),
          }
        )
      }

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      await loadProducts()

      setCode('')
      setName('')
      setCategory('')
      setPrice('')
      setLocation('')
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error saving product:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η αποθήκευση του προϊόντος.'
          : 'The product could not be saved.'
      )
    }
  }

  const handleDelete = async (id?: number) => {
    if (id === undefined) {
      return
    }

    const confirmDelete = window.confirm(
      isGreek
        ? 'Θέλεις σίγουρα να διαγράψεις αυτό το προϊόν;'
        : 'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η διαγραφή του προϊόντος.'
          : 'The product could not be deleted.'
      )
    }
  }

  return (
    <div className="products-page">

      <div className="products-header">
        <div>
          <h1>
            {isGreek ? 'Προϊόντα' : 'Products'}
          </h1>

          <p>
            {isGreek
              ? 'Διαχείριση προϊόντων αποθήκης'
              : 'Warehouse product management'}
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={openNewProductForm}
        >
          + {isGreek ? 'Νέο προϊόν' : 'New Product'}
        </button>
      </div>

      {showForm && (
        <div className="product-form-container">
          <div className="product-form">

            <div className="form-header">
              <h2>
                {editingId !== null
                  ? isGreek
                    ? 'Επεξεργασία προϊόντος'
                    : 'Edit Product'
                  : isGreek
                    ? 'Νέο προϊόν'
                    : 'New Product'}
              </h2>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>
                {isGreek
                  ? 'Κωδικός προϊόντος'
                  : 'Product Code'}
              </label>

              <input
                type="text"
                placeholder="e.g. PRD-002"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                {isGreek
                  ? 'Όνομα προϊόντος'
                  : 'Product Name'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'Όνομα προϊόντος'
                    : 'Product name'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                {isGreek ? 'Κατηγορία' : 'Category'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. Ηλεκτρονικά'
                    : 'e.g. Electronics'
                }
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                {isGreek ? 'Τιμή' : 'Price'}
              </label>

              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                {isGreek
                  ? 'Θέση αποθήκης'
                  : 'Warehouse Location'}
              </label>

              <input
                type="text"
                placeholder="e.g. A-02"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-actions">

              <button
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                {isGreek ? 'Ακύρωση' : 'Cancel'}
              </button>

              <button
                className="save-button"
                onClick={handleSave}
              >
                {isGreek ? 'Αποθήκευση' : 'Save'}
              </button>

            </div>

          </div>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">

          <thead>
            <tr>
              <th>
                {isGreek ? 'Κωδικός' : 'Code'}
              </th>

              <th>
                {isGreek ? 'Προϊόν' : 'Product'}
              </th>

              <th>
                {isGreek ? 'Κατηγορία' : 'Category'}
              </th>

              <th>
                {isGreek ? 'Τιμή' : 'Price'}
              </th>

              <th>
                {isGreek ? 'Θέση' : 'Location'}
              </th>

              <th>
                {isGreek ? 'Ενέργειες' : 'Actions'}
              </th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (
              <tr key={product.id}>

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
                  {product.price.toFixed(2)} €
                </td>

                <td>
                  {product.location}
                </td>

                <td>

                  <button
                    className="action-button"
                    onClick={() => openEditForm(product)}
                  >
                    {isGreek
                      ? 'Επεξεργασία'
                      : 'Edit'}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product.id)}
                  >
                    {isGreek
                      ? 'Διαγραφή'
                      : 'Delete'}
                  </button>

                </td>

              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center' }}
                >
                  {isGreek
                    ? 'Δεν υπάρχουν προϊόντα.'
                    : 'No products.'}
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

    </div>
  )
}

export default Products