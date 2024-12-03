const { Resource } = require('../models/Resource');
const fs = require('fs').promises;
 
// Function to read JSON file
async function readJSON(filename) {
    try {
        console.log(`Reading file: ${filename}`);  // Log the file being read
        const data = await fs.readFile(filename, 'utf8');
        console.log(`File read successfully: ${filename}`); // Log successful read
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filename}:`, err);  // Log error with the filename
        throw err;
    }
}
 
// Function to write to the JSON file
async function writeJSON(object, filename) {
    try {
        console.log(`Writing to file: ${filename}`); // Log the file being written to
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        console.log(`Data written to file: ${filename}`);  // Log successful write
        return allObjects;
    } catch (err) {
        console.error(`Error writing to file ${filename}:`, err);  // Log error with the filename
        throw err;
    }
}
 
// Function to check for duplicate title or description
async function checkDuplicate(title, description) {
    console.log(`Checking for duplicates: title="${title}", description="${description}"`);
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
 
    console.log(`Duplicate check result: duplicateTitle=${duplicateTitle}, duplicateDescription=${duplicateDescription}`);
    return { duplicateTitle, duplicateDescription };
}
 
// Function to add a new resource
async function addResource(req, res) {
    console.log('Adding new resource with the following data:', req.body); // Log the incoming request data
    const { title, description, author } = req.body;
 
    // Validate required fields
    if (!title || title.trim() === '') {
        console.log('Title is missing or empty');
        return res.status(400).json({ message: 'Validation error: Title is required' });
    }
    if (!description || description.trim() === '') {
        console.log('Description is missing or empty');
        return res.status(400).json({ message: 'Validation error: Description is required' });
    }
    if (!author || author.trim() === '') {
        console.log('Author email is missing or empty');
        return res.status(400).json({ message: 'Validation error: Author email is required' });
    }
 
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author)) {
        console.log('Invalid email format:', author);
        return res.status(400).json({ message: 'Validation error: Invalid email format' });
    }
 
    // Check for duplicate title or description
    const { duplicateTitle, duplicateDescription } = await checkDuplicate(title, description);
 
    if (duplicateTitle && duplicateDescription) {
        console.log('Duplicate title and description found');
        return res.status(400).json({ message: 'Title and Description already exist' });
    }
    if (duplicateTitle) {
        console.log('Duplicate title found');
        return res.status(400).json({ message: 'Title already exists' });
    }
    if (duplicateDescription) {
        console.log('Duplicate description found');
        return res.status(400).json({ message: 'Description already exists' });
    }
 
    // Create a new resource if no duplicates exist
    const newResource = new Resource(title, description, author);
    const updatedResources = await writeJSON(newResource, 'utils/resources.json');
 
    console.log('New resource added successfully:', newResource);
    return res.status(201).json(updatedResources);
}
 
module.exports = {
    readJSON, writeJSON, addResource
};