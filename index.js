const express = require("express")
const app = express()
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

  function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) 
  // The maximum is exclusive and the minimum is inclusive
  }

app.post('/api/persons', (request, response) => {
  const newEntry = {
    id: String(getRandomInt(1, 10000)),
    name: request.body.name,
    number: request.body.number
  }
  if (!newEntry.name) {
    return response.status(400).json({error: "name is missing"})
  }

  if (!newEntry.number) {
    return response.status(400).json({error: "number is missing"})
  }

  const nameAlreadyExists = phonebook.some((n) => n.name === newEntry.name)

  if (nameAlreadyExists) {
    return response.status(400).json({error: "name must be unique"})
  }
  const updated = phonebook.concat(newEntry)
  response.status(201).json(updated)
  console.log(updated)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(e => e.id !== id)
  response.json(phonebook)
  //response.status(200).end()
  console.log(phonebook)
})

app.get('/api/persons', (request, response) =>
    response.json(phonebook)
)

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const contact = phonebook.find( (c) => c.id === id )
  if (contact) {
    response.json(contact)
  }
  else {
    response.status(404).end()
  }
  console.log(`this is ${contact}`)
})

app.get('/info', (request, response) => {
  const phonebookdata = {
  entries: phonebook.length,
  datetime: new Date()
}
    response.send(`
      <p>Phonebook has info for ${phonebookdata.entries} people</p>
      <p>${phonebookdata.datetime}</p>
      `)
//console.log(phonebook.length)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
    )