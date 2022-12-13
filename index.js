const express = require('express')
const morgan = require('morgan')
const cors = require("cors");
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"));

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getRandomID = () => {
    return Math.floor(Math.random() * 1000)
} 
// GET requests

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
    const totalPersons = persons.length
    const currentTime = new Date()
    response.send(
        `<p>Phonebook has info for ${totalPersons} people</p>
        <p>${currentTime}</p>
        `
    )
})

app.get('/', (request, response) => {
    response.json(persons)
})

// PUT requests

// POST requests
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const nameAlreadyExists = persons.find(person => person.name === body.name) ? true : false
    if(nameAlreadyExists){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: getRandomID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

// DELETE requests
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

///////  catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
  };
  app.use(unknownEndpoint);

// Running server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port the ${PORT}`)
})