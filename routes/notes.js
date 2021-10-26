const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile, } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// Gets all notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)));
});

// Gets specific note
notes.get('/:id', (req, res) => {
    const id = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((note) => note.id === id);
        return result.length > 0
        ? res.json(result)
        : res.json('Hmm...There isn\'t a note with that id!');
    });
});

// Posts new note
notes.post('/', (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json('Noted!');
    } else {
        res.error('Something went wrong adding this note!')
    };
});

// Deletes a note
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((note) => note.id !== noteId);
        writeToFile('./db/db.json', result);
        res.json(`This note has been deleted!`);
    });
});

module.exports = notes;