import { useState } from 'react'
import './App.css'
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [Desc, setDesc] = useState('');
  const [edit_desc, setEditDesc] = useState('')
  const [TabID, SetTabID] = useState('')
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false)
  const [visible, setVisible] = useState(false)

  /* Start View Pop up and display the corresponded data */
  const toggleVisibility = (value) => {
    setVisible(!visible);
    axios
      .post("http://localhost:5000/api/edit_data", { value })
      .then((response) => {
        console.log(response.data)
        SetTabID(response.data.id)
        setEditDesc(response.data.Description)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /* End View Pop up and display the corresponded data */

  /* Start Add Description */
  const handleSubmit = () => {
    setFlag(false)
    console.log(Desc)
    if (Desc) {
      axios.post("http://localhost:5000/api/add_lists", { Desc })
        .then(response => {
          console.log(response)
          setFlag(true)
          setDesc('')
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      alert("Please Enter Description")
    }
  }
  /* End Add Description */

  /* Start View Data */
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:5000/api/view_data")
        .then((response) => {
          console.log(response.data)
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    fetchData()
  }, [flag])
  /* End View Data */

  /*Start Close pop up Function */
  const onClose = () => {
    setVisible(false)
  }
  /* End Close pop up Function */

  const handleUpdate = () => {
    setFlag(false)
    axios.post("http://localhost:5000/api/update_data", { TabID, edit_desc })
      .then(response => {
        console.log(response)
        setFlag(true)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const Delete = (RowTabID) => {
    setFlag(false)
    axios.post("http://localhost:5000/api/delete_data", { RowTabID })
      .then(response => {
        console.log(response)
        setFlag(true)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <>
      <div>
        <div className='d-flex gap-3'>
          <input type="text" className='form-control w-50' value={Desc} onChange={(e) => setDesc(e.target.value)} />
          <button className='btn btn-primary' onClick={handleSubmit}>Add</button>
        </div>

        <div className='card mt-3 p-2'>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className='text-start'>{row.Description}</td>
                  <td> <FaEdit size={20} style={{ color: "blue" }} onClick={() => toggleVisibility(row.id)} /></td>
                  <td><FaTrash size={20} style={{ color: "red" }} onClick={() => Delete(row.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible && (
          <div className=''
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
            <div className='card w-50 p-2'>
              <div className='text-end'><FontAwesomeIcon icon={faXmark} onClick={onClose} />
              </div>
              <div className='p-2'>
                <div className=''>
                  <input type="text" className='form-control' value={edit_desc} onChange={(e) => { setEditDesc(e.target.value) }} />
                  <input type="text" className='form-control' value={TabID} readOnly hidden />
                </div>
                <div className='d-flex gap-3 justify-content-center p-2'>
                  <button type='button' className='btn btn-primary' onClick={onClose}>Close</button>
                  <button className='btn btn-primary' onClick={handleUpdate}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div >

    </>
  )
}

export default App