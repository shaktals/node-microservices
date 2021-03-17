import { useState } from 'react'
import axios from 'axios'

export default function ({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)

      onSuccess?.(response.data)
      return response.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err?.response?.data?.errors.map(err => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}
