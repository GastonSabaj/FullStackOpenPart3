const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@micluster.uix7hrk.mongodb.net/AgendaApp?retryWrites=true&w=majority&appName=MiCluster`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

if (process.argv.length < 4) {
    console.log("Phonebook:");
    Person.find().then(result => {
        result.forEach(person => {
            console.log(person.name, person.number);
        });
        // Cerrar la conexión después de imprimir el resultado
        mongoose.connection.close();
    });
} else {
    //Si tiene mas de 4 argumentos, es una nueva persona
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        id: Math.floor(Math.random() * 1000),
        name: name,
        number: number,
    });

    person.save().then(result => {
        // Debería imprimir algo como esto: added Anna number 040-1234556 to phonebook
        console.log(`added ${name} number ${number} to phonebook`);
        // Cerrar la conexión después de agregar una nueva persona
        mongoose.connection.close();
    });
}
