import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

const RetrieveText = ({ onGet }) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  const params = useParams()

  useEffect(() => {
    const fetchText = async () => {
      const res = await onGet(params.identifier, params.password)
      setText(res)
      setLoading(false)
    }
    fetchText()
  }, [onGet, params])

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <div className="form-control">
      <input type="text" value={text} readOnly color='#f5f5f5' />
    </div>
  )
}

export default RetrieveText