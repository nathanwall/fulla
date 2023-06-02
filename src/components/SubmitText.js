import { useState } from 'react';

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
      <div className="form-control">
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
            <label>Share this secure link with the recipient:</label>
            <input type="text" value={url} readOnly />
          </>
        ) : (
          <div />
        )} 
      </div>
    </form>
  )
}

export default SubmitText