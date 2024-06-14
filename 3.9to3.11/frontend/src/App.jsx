import { useState, useEffect } from 'react'
import personService from './services/persons'



const FilteredList = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.map((person, index) => {
        return <PersonDetails key={index} person={person} handleDelete={handleDelete} />;
      })}
    </div>
  );
};

const PersonDetails = ({ person, handleDelete }) => {
  //console.log("Person:", person); // Agrega esta línea para depurar
  return (
    <div>
      <p>
        {person.name} {person.number} - {person.id}
        <button onClick={() => handleDelete(person.id)}>delete</button>
      </p>
    </div>
  );
};

const Form = ({addPerson, newName, setNewName, newNumber, setNewNumber}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Notification = ({ message, success, error }) => {
  if (message === null) {
    return null
  }

  
  const messageStyle = {
    backgroundColor: error ? 'red' : success ? 'green' : 'gray',
    color: '#3baf41',
    border: 'solid #3baf41',
    fontSize: 20,
    borderRadius: '5px',
    padding: '10px',
    opacity: message ? 1 : 0,
    height: message ? 'auto' : 0, // Cambiamos la altura del mensaje
    transition: 'opacity 0.5s ease, height 0.5s ease', // Agregamos la transición para la altura
  };
  

  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [message, setMessage] = useState('')
  const [notificationProps, setNotificationProps] = useState({
    success: false,
    error: false,
  });
  
  //Event listener for form
  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some(person => person.name === newName)) {
      
      //Si la persona ya existía, la actualizo
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setFilteredPersons(filteredPersons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('') // Limpia el input de nombre
            setNewNumber('')
            setTimeout(() => {
              setMessage(`Updated ${returnedPerson.name}`)
            }, 5000)
            setNotificationProps({ success: true, error: false });
          })
          .catch(error => {
            console.error('Error al actualizar la persona:', error);
            setMessage(`Error: ${error.message}`);
            setNotificationProps({ success: false, error: true });
          })
      }
      return
    }

    //Si la persona no existia, voy y la creo
    let newPerson = { name: newName, number: newNumber }
    personService
    .create(newPerson)
    .then(returnedPerson => {
      setPersons([...persons, returnedPerson]); // Usar returnedPerson en lugar de newPerson
      setFilteredPersons([...filteredPersons, returnedPerson]);
      setNewName('');
      setNewNumber('');
      setTimeout(() => {
        setMessage(`Added ${returnedPerson.name}`);
      }, 5000);
      setNotificationProps({ success: true, error: false });
    })
    .catch(error => {
      setMessage(`Error: ${error.message}`); // Puedes mostrar un mensaje de error en la interfaz de usuario
      setNotificationProps({ success: false, error: true });
      /* 
        Quiero imprimir el error en la consola.
      */

       console.log(error.response.data.error)

    });

  }
  const handleDelete = (id) => {
    const name = persons.find(person => person.id === id)?.name;
    if (!name) {
      console.error('No se encontró una persona con ese ID');
      return;
    }
    if (window.confirm(`Delete ${name}?`)) {
      console.log("Borro a la persona!");
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setFilteredPersons(filteredPersons.filter(person => person.id !== id));
          setMessage(`Eliminated ${name}`);
  
          // Establecer un temporizador para cambiar el estado de message a null después de 5 segundos
          setTimeout(() => {
            setMessage(null);
          }, 5000);

          setNotificationProps({ success: true, error: false });

        })
        .catch(error => {
          console.error('Error al eliminar la persona:', error);
          setMessage(`Error: ${error.message}`); // Puedes mostrar un mensaje de error en la interfaz de usuario
          setNotificationProps({ success: false, error: true });
        });
    }
  };
  

  const filterFunction = (event) => {
    console.log(event.target.value)
    setFilterInput(event.target.value)
    if(event.target.value === '') {
      setFilteredPersons(persons)
      return
    }
    else{
      //Para cada persona, voy a convertir el nombre en minusculas 
      console.log(persons)
      const filtered = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
      setFilteredPersons(filtered);
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={notificationProps.success} error={notificationProps.error} />

      {/* Mi formulario */}
      <Form addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
  
      <h2>Numbers</h2>
      <div>
          filter shown with <input value={filterInput} onChange= {filterFunction}/>

          <FilteredList filteredPersons={filteredPersons} handleDelete={handleDelete} />
      </div>
    </div>
  )
}

export default App