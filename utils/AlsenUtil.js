const { Resource } = require('../models/Resource');
const fs = require('fs').promises;

// Function to read JSON file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to write to the JSON file
async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to check for duplicate title or description
async function checkDuplicate(title, description) {
    const allResources = await readJSON('utils/resources.json');
    let duplicateTitle = false;
    let duplicateDescription = false;

    allResources.forEach(resource => {
        if (resource.title.toLowerCase() === title.toLowerCase()) {
            duplicateTitle = true;
        }
        if (resource.description.toLowerCase() === description.toLowerCase()) {
            duplicateDescription = true;
        }
    });

    return { duplicateTitle, duplicateDescription };
}

// Function to add a new resource
async function addResource(req, res) {
    try {
        const { title, description, author } = req.body;

        // Validate required fields
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Validation error: Title is required' });
        }
        if (!description || description.trim() === '') {
            return res.status(400).json({ message: 'Validation error: Description is required' });
        }
        if (!author || author.trim() === '') {
            return res.status(400).json({ message: 'Validation error: Author email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(author)) {
            return res.status(400).json({ message: 'Validation error: Invalid email format' });
        }

        // Check for duplicate title or description
        const { duplicateTitle, duplicateDescription } = await checkDuplicate(title, description);

        if (duplicateTitle && duplicateDescription) {
            return res.status(400).json({ message: 'Title and Description already exist' });
        }
        if (duplicateTitle) {
            return res.status(400).json({ message: 'Title already exists' });
        }
        if (duplicateDescription) {
            return res.status(400).json({ message: 'Description already exists' });
        }

        // Create a new resource if no duplicates exist
        const newResource = new Resource(title, description, author);
        const updatedResources = await writeJSON(newResource, 'utils/resources.json');

        return res.status(201).json(updatedResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addResource
};
