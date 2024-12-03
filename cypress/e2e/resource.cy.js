describe('Upload Blog Feature', () => {
  let baseUrl;

  // Helper function to generate random data
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

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
    cy.wait(200); // Allow time for page to load

    // Open the modal
    cy.get('button[data-target="#blogModal"]').click(); 

    // Generate random data for the blog
    const randomTitle = `Blog Title ${generateRandomString(10)}`;
    const randomDescription = `Description for ${generateRandomString(20)} blog post.`;
    const randomEmail = `${generateRandomString(5)}@example.com`;

    // Fill out the form
    cy.get('#title').type(randomTitle, { force: true });
    cy.get('#description').type(randomDescription, { force: true });
    cy.get('#author').type(randomEmail, { force: true });

    // Click the upload button
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Make sure on index.html
    cy.url().should('include', 'index.html');

    // Verify the blog post is displayed
    cy.get('.blog-post')  // Assuming each post has the class 'blog-post'
      .contains(randomTitle)  // Check if the title exists within the blog post container
      .should('exist'); // Ensure it exists in the list
  });

  it('should show an error when title is missing', () => {
    cy.visit(baseUrl);
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#description').type('This is a valid blog description.', { force: true });
    cy.get('#author').type('test@example.com', { force: true });

    // Click the upload button
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Verify error message for missing title
    cy.get('#message').should('be.visible').and('contain', 'Title is required');
  });

  it('should show an error when description is missing', () => {
    cy.visit(baseUrl);
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#title').type('Valid Blog Title', { force: true });
    cy.get('#author').type('test@example.com', { force: true });

    // Click the upload button
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Verify error message for missing description
    cy.get('#message').should('be.visible').and('contain', 'Error: Validation error: Description is required');
  });

  it('should show an error when author email is invalid', () => {
    cy.visit(baseUrl);
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal
    cy.get('#title').type('Valid Blog Title', { force: true });
    cy.get('#description').type('This is a valid blog description.', { force: true });
    cy.get('#author').type('invalid-email', { force: true });

    // Click the upload button
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Verify error message for invalid email
    cy.get('#message').should('be.visible').and('contain', 'Error: Validation error: Invalid email format');
  });

  it('should show an error when all fields are empty', () => {
    cy.visit(baseUrl);
    cy.get('button[data-target="#blogModal"]').click(); // Open the modal

    // Click the upload button without entering any input
    cy.get('button[class="btn btn-primary"]').contains('Upload Blog').click();

    // Verify error message for missing title
    cy.get('#message').should('be.visible').and('contain', 'Error: Validation error: Title is required');
  });
});
