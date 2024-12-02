describe('Upload Blog Feature', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task('stopServer'); // Stop the server after the tests
  });

  it('should successfully upload a blog with valid inputs', () => {
    cy.wait(10000)
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#title').type('Valid Blog Title', { force: true });
    cy.get('#description').type('This is a valid blog description.', { force: true });
    cy.get('#author').type('test@example.com', { force: true });

    // Click the upload button
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Verify the blog is displayed in the table
    cy.get('#tableContent').contains('Valid Blog Title').should('exist');
  });

  it('should show an error when title is missing', () => {
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#description').type('This is a valid blog description.', { force: true });
    cy.get('#author').type('test@example.com', { force: true });

    // Click the upload button
    cy.get('btn btn-primary').contains('Upload Blog').click();

    // Verify error message
    cy.get('#message').should('be.visible').and('contain', 'Title is required');
  });

  it('should show an error when description is missing', () => {
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#title').type('Valid Blog Title', { force: true });
    cy.get('#author').type('test@example.com', { force: true });

    // Click the upload button
    cy.get('button').contains('Upload Blog').click();

    // Verify error message
    cy.get('#message').should('be.visible').and('contain', 'Description is required');
  });

  it('should show an error when author email is invalid', () => {
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#title').type('Valid Blog Title', { force: true });
    cy.get('#description').type('This is a valid blog description.', { force: true });
    cy.get('#author').type('invalid-email', { force: true });

    // Click the upload button
    cy.get('button').contains('Upload Blog').click();

    // Verify error message
    cy.get('#message').should('be.visible').and('contain', 'Please enter a valid author email');
  });

  it('should show an error when all fields are empty', () => {
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal

    // Click the upload button without entering any input
    cy.get('button').contains('Upload Blog').click();

    // Verify error message
    cy.get('#message').should('be.visible').and('contain', 'Title is required');
  });
});
