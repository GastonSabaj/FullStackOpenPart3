var morgan = require('morgan')
const express = require('express')
const app = express()

app.use(morgan('tiny'));
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))
const Person = require('./models/person')


// Define un nuevo token personalizado en Morgan
morgan.token('postData', function(req, res) {
    return JSON.stringify(req.body);
});

// Configura Morgan para que muestre los datos de la solicitud POST
app.use(morgan(':method :url :status :response-time ms - :postData'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
      })
})

app.get('/api/persons/:id', (request, response, next) => {
    //El ID es de tipo ObjectID y no de tipo String ni Number
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => { 
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = new Person({
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    })

    //El metodo save() es de mongoose
    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
//Middleware de manejo de errores
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})