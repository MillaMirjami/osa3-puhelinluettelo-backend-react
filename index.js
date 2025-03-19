const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./Models/person')

// Create your own logger token
morgan.token('body', (req) => {
   return req.body ? JSON.stringify(req.body) : '' 
})

// Start using middlewares
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => response.json(person))
})



app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({error: "name or number missing"})
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save().then(savedPerson => response.json(savedPerson))
})

app.put('/api/persons/:id', (request, response) => {
    Person.findByIdAndUpdate(request.params.id, request.body).then(updatedPerson => response.send(updatedPerson))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(deletedPerson => response.status(204).send('deletion successful'))
})

app.get('/info', (request, response) => {
    const personsLength = Person.countDocuments({}).number
    const currentDate= new Date()
    response.send(`<p>Phonebook has info for ${personsLength} people</p><p>${currentDate}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// const generateId = () => {

//     if(persons.length > 0) {
//         const currentIds = persons.map(p => Number(p.id))
//         let randomId
//         do {
//             randomId = Math.floor(Math.random() * (1000000 - 5 + 1)) + 5
//         }while(currentIds.includes(randomId))
//             return String(randomId)
//     } else {
//         return "1"
//     }
// }