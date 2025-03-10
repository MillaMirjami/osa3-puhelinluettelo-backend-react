const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelance",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

// Create your own logger token
morgan.token('body', (req) => {
   return req.body ? JSON.stringify(req.body) : '' 
})

// Start using middlewares
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person) {
        response.send(person)
    } else {
        response.status(404).send({error: "person not found"})
    }
})

const generateId = () => {

    if(persons.length > 0) {
        const currentIds = persons.map(p => Number(p.id))
        let randomId
        do {
            randomId = Math.floor(Math.random() * (1000000 - 5 + 1)) + 5
        }while(currentIds.includes(randomId))
            return String(randomId)
    } else {
        return "1"
    }

}


app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({error: "name or number missing"})
    }
    if(persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({error: "this name already exists"})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
    

})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    response.send(body)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const personsLength = persons.length
    const currentDate= new Date()
    response.send(`<p>Phonebook has info for ${personsLength} people</p><p>${currentDate}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})