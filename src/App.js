import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import RetrieveText from './components/RetrieveText';
import SubmitText from './components/SubmitText';
import bcrypt from 'bcryptjs';
import uuid from 'react-uuid';
import { DB_SERVER } from './constants';

function App() {

  const createRecord = async (data) => {
    const res = await fetch(`http://${DB_SERVER.name}:${DB_SERVER.port}/texts`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return res;
  }

  const readRecord = async (identifier) => {
    const res = await fetch(`http://${DB_SERVER.name}:${DB_SERVER.port}/texts?identifier=` + identifier, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })

    return res;
  }
  
  const updateRecord = async (data) => {
    const res = await fetch(`http://${DB_SERVER.name}:${DB_SERVER.port}/texts/` + data.id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    return res.ok;
  }

  const deleteRecord = async (data) => {
    const res = await fetch(`http://${DB_SERVER.name}:${DB_SERVER.port}/texts/` + data.id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
    return res.ok;
  }

  const generatePassword = () => {
    const length = 20;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!£$%^&*()_+{}:@~<>?";
    let pwd = "";
    for (let i = 0; i < length; i++) {
        let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
        randomNumber = randomNumber / 0x100000000;
        randomNumber = Math.floor(randomNumber * charset.length);

        pwd += charset[randomNumber];
    }

    const hash = bcrypt.hashSync(pwd, 10);
    const password = {
      password: pwd,
      hash: hash,
      encoded: Buffer.from(pwd).toString('hex')
    }

    return password;
  }
  
  const failedAttempt = async (data) => {
    let deleted = false;
    data.attempts = data.attempts + 1;

    if (data.attempts > 2) {
      await deleteRecord(data);
      deleted = true;
    } else {
      await updateRecord(data);
      data.attempts = 0;
    }
    return deleted;
  }

  const decryptText = async (data, encodedPassword) => {
    const key = Buffer.from(encodedPassword, 'hex').toString('utf-8');
    let originalText = ""; 
    if (data) {
      if (bcrypt.compareSync(key, data.password)) {
        const bytes = CryptoJS.AES.decrypt(data.text, key);
        originalText = bytes.toString(CryptoJS.enc.Utf8);
        await deleteRecord(data);
      } else {
        await failedAttempt(data) 
      }
    }

    
    return originalText;
  }

  const getText = async (identifier, encodedPassword) => {
    const res = await readRecord(identifier);
    const data = await res.json();
    
    return decryptText(data[0], encodedPassword);
  }


  const addText = async (text) => {
    const password = generatePassword();
    let crypt = CryptoJS.AES.encrypt(text.text, password.password,).toString();
    let safeUrl = "";
    const record = {
      identifier: uuid(),
      text: crypt,
      created: new Date(),
      password: password.hash,
      attempts: 0
    }

    const res = await createRecord(record);

    if (res.status === 201) {
      safeUrl = window.location.href + record.identifier + "/" + password.encoded;
    }
    
    return safeUrl;
  }
  
  return (
    <Router>
      <div className="container-fluid" style={{display: 'flex', justifyContent: 'center'}}>
        <main>
          <Routes>
            <Route path="/" element={<SubmitText onAdd={addText} />} />
            <Route path="/:identifier/:password" element={<RetrieveText onGet={getText} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;