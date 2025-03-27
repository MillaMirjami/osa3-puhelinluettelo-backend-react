const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.5i94f.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(result => console.log('Connected to MongoDB'))
.catch(error => console.log('Error connecting to db', error.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// personSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//     }
//   })

const Person = mongoose.model('Person', personSchema)

if(process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
    })
}

else if (process.argv.length === 3) {
    Person
    .find({})
    .then(persons => {
        console.log('Phonebook:')
        persons.forEach(person => { console.log(`${person.name} ${person.number}`)
        })
    })
}

module.exports = mongoose.model('Person', personSchema)
