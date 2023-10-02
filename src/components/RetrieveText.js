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
      <div class="input-group mb-3">
        <input type="text" class="form-control" style={{ fontFamily: 'monospace' }} value={text} readOnly color='#f5f5f5' />
        { window.location.protocol === 'https:' ? (
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default RetrieveText