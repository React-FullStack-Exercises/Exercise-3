import { useState, useEffect } from 'react'
import axios from "axios";

import Person from './components/Person';
import Notification from './components/Notification';
import personService from './services/persons'

const App = () => {

  useEffect(() => {
    personService
      .getAll().then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [notification, setNotification] = useState({
    type: '',
    message: ''
  })

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterNameChange = (event) => {
    setFilterQuery(event.target.value)
  }

  const handleNotification = (type, message) => {
    setNotification({
      type: type,
      message: message
    })
    setTimeout(() => {
      setNotification({type:'', message:''})
    }, 5000)
  }

  const personsToShow = filterQuery === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filterQuery.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const alreadyExists = persons.some(person => person.name === newName)
    if (alreadyExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const id = person.id
        const updatedPerson = { ...person, number: newNumber }

        personService
          .update(id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
            handleNotification('success', `Updated ${returnedPerson.name}`)
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== id))
            handleNotification('error', `Information of ${updatedPerson.name} has already been removed from server`)
          })
      }
    }
    else {
      const newObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }
      personService
        .create(newObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          handleNotification('success', `Added ${returnedPerson.name}`)
        })
        .catch(error => {
          handleNotification('error', error.response.data.error)
        })
    }
    setNewName('')
    setNewNumber('')
  }
  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id)
        .then(returnedData => {
          // console.log(returnedData)
          setPersons(persons.filter(person => person.id !== id))
          handleNotification('success', `Deleted ${name}`)
        })
    }
  }
  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Notification type={notification.type} message={notification.message} />
      <Filter filterQuery={filterQuery} handleFilterQueryChange={handleFilterNameChange} />

      <h2>Add a new</h2>
      <PersonForm handleSubmit={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      {
        personsToShow.map(person => <Person key={person.id} person={person} deletePerson={() => handleDeletePerson(person.id, person.name)} />)
      }
    </div>
  );
}

const Filter = ({ filterQuery, handleFilterQueryChange }) => (
  <div>
    filter shown with <input value={filterQuery} onChange={handleFilterQueryChange} />
  </div>
)

const PersonForm = (props) => {
  const newName = props.newName
  const newNumber = props.newNumber
  const handleNameChange = props.handleNameChange
  const handleNumberChange = props.handleNumberChange
  const addPerson = props.handleSubmit
  return (
    <form onSubmit={addPerson}>
      <div>
        <p>name: <input value={newName} onChange={handleNameChange} /> </p>
        <p>number: <input value={newNumber} onChange={handleNumberChange} /> </p>
      </div>
      <div>
        <button type='submit'>Add</button>
      </div>
    </form>
  )
}

export default App;
