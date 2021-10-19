import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios'

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    axios.get(URL + "index.php")
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: item, amount: amount })
    axios.post(URL + "add.php", json, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setItem("");
        setAmount(0);
      }).catch(error => {
        alert(error.response.data.error)
      })
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + "delete.php", json, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className="container">
      <h3>Shoppinglist</h3>
      <form onSubmit={save}>
        <label>New item</label>&nbsp;
        <input value={item} onChange={e => setItem(e.target.value)} />
        <label>&nbsp;Amount:</label>&nbsp;
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        &nbsp;<button>Add</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            {item.description}&nbsp;{item.amount}&nbsp;
            <a href='#' className='delete' onClick={() => remove(item.id)}>Remove</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
