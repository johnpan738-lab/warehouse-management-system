import { useEffect, useState } from 'react'
import './Warehouses.css'
import { useLanguage } from '../LanguageContext'

type Warehouse = {
  id?: number
  code: string
  name: string
  address: string
  capacity: number
}

function Warehouses() {
  const { language } = useLanguage()
  const isGreek = language === 'Ελληνικά'

  const [showForm, setShowForm] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState('')

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
    loadWarehouses()
  }, [])

  const openNewWarehouseForm = () => {
    setEditingId(null)

    setCode('')
    setName('')
    setAddress('')
    setCapacity('')

    setShowForm(true)
  }

  const openEditForm = (warehouse: Warehouse) => {
    if (warehouse.id === undefined) {
      return
    }

    setEditingId(warehouse.id)

    setCode(warehouse.code)
    setName(warehouse.name)
    setAddress(warehouse.address)
    setCapacity(String(warehouse.capacity))

    setShowForm(true)
  }

  const handleSave = async () => {
    if (!code || !name || !address || !capacity) {
      alert(
        isGreek
          ? 'Συμπλήρωσε όλα τα πεδία.'
          : 'Please fill in all fields.'
      )

      return
    }

    const warehouseData = {
      code,
      name,
      address,
      capacity: Number(capacity),
    }

    try {
      let response: Response

      if (editingId !== null) {
        response = await fetch(
          `http://localhost:8080/warehouses/${editingId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(warehouseData),
          }
        )
      } else {
        response = await fetch(
          'http://localhost:8080/warehouses',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(warehouseData),
          }
        )
      }

      if (!response.ok) {
        throw new Error('Failed to save warehouse')
      }

      await loadWarehouses()

      setCode('')
      setName('')
      setAddress('')
      setCapacity('')
      setEditingId(null)
      setShowForm(false)

      alert(
        isGreek
          ? 'Η αποθήκη αποθηκεύτηκε επιτυχώς.'
          : 'Warehouse saved successfully.'
      )
    } catch (error) {
      console.error('Error saving warehouse:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η αποθήκευση της αποθήκης.'
          : 'Warehouse could not be saved.'
      )
    }
  }

  const handleDelete = async (id?: number) => {
    if (id === undefined) {
      return
    }

    const confirmDelete = window.confirm(
      isGreek
        ? 'Θέλεις σίγουρα να διαγράψεις αυτή την αποθήκη;'
        : 'Are you sure you want to delete this warehouse?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/warehouses/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete warehouse')
      }

      await loadWarehouses()

      alert(
        isGreek
          ? 'Η αποθήκη διαγράφηκε.'
          : 'Warehouse deleted.'
      )
    } catch (error) {
      console.error('Error deleting warehouse:', error)

      alert(
        isGreek
          ? 'Δεν ήταν δυνατή η διαγραφή της αποθήκης.'
          : 'Warehouse could not be deleted.'
      )
    }
  }

  return (
    <div className="warehouses-page">

      <div className="warehouses-header">

        <div>
          <h1>
            {isGreek ? 'Αποθήκες' : 'Warehouses'}
          </h1>

          <p>
            {isGreek
              ? 'Διαχείριση αποθηκευτικών χώρων'
              : 'Warehouse management'}
          </p>
        </div>

        <button
          className="add-warehouse-button"
          onClick={openNewWarehouseForm}
        >
          + {isGreek ? 'Νέα αποθήκη' : 'New warehouse'}
        </button>

      </div>

      {showForm && (
        <div className="warehouse-form-container">

          <div className="warehouse-form">

            <div className="form-header">

              <h2>
                {editingId !== null
                  ? isGreek
                    ? 'Επεξεργασία αποθήκης'
                    : 'Edit warehouse'
                  : isGreek
                    ? 'Νέα αποθήκη'
                    : 'New warehouse'}
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
                  ? 'Κωδικός αποθήκης'
                  : 'Warehouse code'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. WH-002'
                    : 'e.g. WH-002'
                }
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Όνομα αποθήκης'
                  : 'Warehouse name'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'Όνομα αποθήκης'
                    : 'Warehouse name'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Διεύθυνση'
                  : 'Address'}
              </label>

              <input
                type="text"
                placeholder={
                  isGreek
                    ? 'π.χ. Πειραιώς 100, Αθήνα'
                    : 'e.g. 100 Piraeus St, Athens'
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

            </div>

            <div className="form-group">

              <label>
                {isGreek
                  ? 'Χωρητικότητα'
                  : 'Capacity'}
              </label>

              <input
                type="number"
                min="0"
                placeholder={
                  isGreek
                    ? 'π.χ. 2000'
                    : 'e.g. 2000'
                }
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
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

      <div className="warehouses-table-container">

        <table className="warehouses-table">

          <thead>

            <tr>

              <th>
                {isGreek ? 'Κωδικός' : 'Code'}
              </th>

              <th>
                {isGreek ? 'Αποθήκη' : 'Warehouse'}
              </th>

              <th>
                {isGreek ? 'Διεύθυνση' : 'Address'}
              </th>

              <th>
                {isGreek ? 'Χωρητικότητα' : 'Capacity'}
              </th>

              <th>
                {isGreek ? 'Ενέργειες' : 'Actions'}
              </th>

            </tr>

          </thead>

          <tbody>

            {warehouses.map((warehouse) => (

              <tr key={warehouse.id}>

                <td>
                  {warehouse.code}
                </td>

                <td>
                  {warehouse.name}
                </td>

                <td>
                  {warehouse.address}
                </td>

                <td>
                  {warehouse.capacity}
                </td>

                <td>

                  <button
                    type="button"
                    className="action-button"
                    onClick={() =>
                      openEditForm(warehouse)
                    }
                  >
                    {isGreek ? 'Επεξεργασία' : 'Edit'}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(warehouse.id)
                    }
                  >
                    {isGreek ? 'Διαγραφή' : 'Delete'}
                  </button>

                </td>

              </tr>

            ))}

            {warehouses.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  style={{ textAlign: 'center' }}
                >
                  {isGreek
                    ? 'Δεν υπάρχουν αποθήκες.'
                    : 'No warehouses found.'}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Warehouses