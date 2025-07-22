import React, { useEffect, useState } from 'react'
import axios from "axios";
import { LiaSortNumericDownSolid } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [completed, setcompleted] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/api/todos")
      .then(response => setTodos(response.data))
      .catch(error => console.error(error))
  }, [])



  const addTodo = () => {
    if (!newTodo.trim()) {
      return toast.error("Task is Empty");
    }
    axios.post("http://localhost:8080/api/todos",
      { title: newTodo, completed: false })

      .then((response) => setTodos([...todos, response.data]));
    setNewTodo("");
    toast.success('Task Successfully Added!')

  }


  const deleteTodo = (id) => {
    axios.delete(`http://localhost:8080/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
    toast('Task delete!',
      {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  const completeTask = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    axios.put(`http://localhost:8080/api/todos/${id}`, {
      ...todo,
      completed: !todo.completed
    })
      .then(response => {
        setTodos(todos.map(t => t.id === id ? response.data : t));
      })
      .catch(error => console.error(error));
  };


  return (
    <div className="h-screen w-screen bg-black text-white flex justify-center items-center">


      <div className="boredr border-1 border-[#232424] rounded-md w-[84%] h-[90%] ">
        <div>
          <h1 className="text-3xl font-bold text-[#fafafa] mt-7 ml-7">Welcome back!</h1>
          <h3 className="font-thin text-[#a1a1a1] ml-7">Here's a list of your tasks for this month.</h3>
          <input type="text" id="addTask" placeholder="Write The Task" className="mt-5 w-143 rounded border border-[#373737] px-3 py-2 text-sm text-gray-800 dark:bg-[#151515] dark:text-gray-200 ml-8"
            onChange={(e) => setNewTodo(e.target.value)} value={newTodo}
          />
          <button className='mt-5 w-60 py-1.5 rounded border border-[#373737] ml-2 bg-[#e5e5e5] text-[#1e1717] font-medium ml-2' onClick={addTodo}> Add Task</button>
        </div>


        <div className=''>
          <ul className='flex justify-center items-center flex-col mt-10'>
            {
              todos.map(todo => (
                <>
                  <li key={todo.id} className='w-[95%] h-10  bg-[#151515]  border border-[#222323] text-[#a1a1a1] flex flex-row items-center justify-between px-3'>
                    <div className='flex flex-row items-center justify-around'>
                      <p className='text-sm'>{todo.title}</p>
                    </div>
                    <span className="h-6 w-6 hover:text-red-300 cursor-pointer" onClick={() => deleteTodo(todo.id)}><MdDeleteOutline size={24} /></span>
                  </li>
                </>
              ))
            }

          </ul>
        </div>



        <Toaster />


      </div>
    </div>
  )
}

export default TodoList
