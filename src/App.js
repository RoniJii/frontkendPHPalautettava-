import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const URL = 'http://localhost/palautettevatyo/'

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setTasks(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function save(e) {
    e.preventDefault();
    const combined = {description:task, amount:amount}
    const json = JSON.stringify(combined)
    console.log(json)
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setTasks(tasks => [...tasks,response.data]);
      setTask('');
      setAmount('');
      console.log(amount)
    }).catch (error => {
      alert(error.response.data.error)
    });
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json, {
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then((response) => {
        const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(newListWithoutRemoved);
    }).catch (error => {
        alert(error.response ? error.response.data.error : error);
    });
}

  return (
    <div className="container">
      <h3>Shopping List</h3>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={task} placeholder="type description" onChange={e => setTask(e.target.value)} />
        <input value={amount} placeholder="type amount" onChange={e => setAmount(e.target.value)} />
        <button>Add</button>
      </form>
      <dl>
        {tasks?.map(task => (
          <dt key={uuidv4()}>{task.description} <a href="/#"> </a> {task.amount} &nbsp;
            <a href="/#" className="delete" onClick={() => remove(task.id)}>
              Delete
            </a>
          </dt>
        ))}
      </dl>
    </div>
  );
}

export default App;
