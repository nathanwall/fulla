import { useState } from 'react';
import { QRCode } from 'react-qr-code';

const SubmitText = ( {onAdd} ) => {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()

    if (!text) {
      alert('Please add text')
      return
    }

    onAdd({ text }).then(url => setUrl(url))

    setText('')
  }

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control" style={{ border: '0px' }}>
        <input
          type="text"
          style={{ fontFamily: text ? 'monospace' : 'inherit'  }}
          placeholder="Input secret"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" value="Rune" className="btn btn-block" />
        {url ? (
          <>
            <div>
              <label>Get the recipient to scan this QR code:</label>
              <QRCode value={url} />
            </div>
            <label>Or share this secure link with the recipient:</label>
            <div className="input-group mb-3">
              <input type="text" className="form-control" style={{ fontFamily: 'monospace' }} value={url} readOnly/>
              { window.location.protocol === 'https:' ? (
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={() => navigator.clipboard.writeText(url)}>Copy</button>
                </div>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <div />
        )} 
      </div>
    </form>
  )
}

export default SubmitText