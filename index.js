const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./Models/person')
const { default: mongoose } = require('mongoose')

// Create your own logger token
morgan.token('body', (req) => {
   return req.body ? JSON.stringify(req.body) : '' 
})

// Start using middlewares
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({error: "name or number missing"})
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', async (request, response, next) => {
    const person = await Person.findById(request.params.id)
    console.log("Received id: ", request.params.id)

    if(!person) {
        response.status(400).json({error: "Person not found"})
    }

    person.name = request.body.name
    person.number = request.body.number

    return person
    .save()
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
        if(!deletedPerson) {
            return response.status(404).json({error: 'Person not found'})
        }
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
    .then(count => {
        const currentDate= new Date()
        response.send(`<p>Phonebook has info for ${count} people</p><p>${currentDate}</p>`)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)


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