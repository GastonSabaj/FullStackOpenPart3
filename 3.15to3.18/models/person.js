const mongoose = require('mongoose')
require('dotenv').config(); // Esto cargará las variables de entorno desde el archivo .env


console.log("la url es", process.env.MONGODB_URI)
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI 

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)