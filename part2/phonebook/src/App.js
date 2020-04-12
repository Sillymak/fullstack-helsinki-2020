import React, { useState, useEffect } from 'react'
import service from './services/persons'

const Notification = ({message, style}) => {
  if (message === null || message === '') {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Filter = ({name, handler}) => {
  return (
    <p>filter shown with <input value={name} onChange={handler} /></p>
  )
}

const AddPersonForm = ({handleSubmit, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} /><br />
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Phonebook = ({persons, handler}) => {
  return (
    <>
    {persons.map(person =>
      <Person key={person.name} person={person} handler={() => {handler(person.id, person.name)}} />
    )}
    </>
  )
}

const Person = ({person, handler}) => {
  return (
    <div >{person.name} {person.number} <input type='button' value='delete' onClick={handler} /></div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ errorStyle, setErrorStyle ] = useState({
      backgroundColor: 'lightgrey',
      borderRadius: '5px',
      color: 'green',
      fontSize: '20px',
      border: '3px solid green',
      padding: '10px'
  })

  useEffect(() => {
    service
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      let update = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)

      if (update) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = {...person, number: newNumber}
        service.update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setErrorMessage(`${returnedPerson.name} has been updated.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)  
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')  
          })
      }

    } else {
      const newPerson = {name: newName, number: newNumber}
      service.create(newPerson)
        .then(returnedPerson => {
          setErrorMessage(`${returnedPerson.name} has been added.`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (id,name) => {
    if(window.confirm(`Delete ${name}?`)) {
      service.deletePerson(id)
        .then(response => {
          if (response.status === 200) {
            setErrorMessage(`${name} has been deleted.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
  
            setPersons(persons.filter(person => person.id !== id))
          }
        }).catch(error => {
          const newErrorStyle = {
            backgroundColor: 'lightgrey',
            borderRadius: '5px',
            color: 'red',
            fontSize: '20px',
            border: '3px solid red',
            padding: '10px'
          }
          const oldErrorStyle = {...errorStyle}

          setErrorStyle(newErrorStyle)
          setErrorMessage(`${name} has already been deleted.`)
          setTimeout(() => {
            setErrorMessage(null)
            setErrorStyle(oldErrorStyle)
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))

        })
    }
  }
  
  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filteredPersons = searchName
    ? persons.filter(person => person.name.toLowerCase().indexOf(searchName.toLowerCase()) > -1)
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} style={errorStyle}/>
      <Filter name={searchName} handler={handleSearchChange} />
      <h3>Add a new</h3>
      <AddPersonForm handleSubmit={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <Phonebook persons={filteredPersons} handler={deletePerson}/>
    </div>
  )
}

export default App