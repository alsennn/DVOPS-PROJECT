function addResource() {
  var response = "";
  var jsonData = new Object();
  jsonData.title = document.getElementById("title").value.trim();
  jsonData.description = document.getElementById("description").value.trim();
  jsonData.author = document.getElementById("author").value.trim();

  // Validate title
  if (jsonData.title === "") {
    document.getElementById("message").innerHTML = 'Title is required!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }
  if (/[^a-zA-Z0-9\s]/.test(jsonData.title)) {  // Check for special characters in title
    document.getElementById("message").innerHTML = 'Title cannot contain special characters!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }

  // Validate description
  if (jsonData.description === "") {
    document.getElementById("message").innerHTML = 'Description is required!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }
  if (/[^a-zA-Z0-9\s]/.test(jsonData.description)) {  // Check for special characters in description
    document.getElementById("message").innerHTML = 'Description cannot contain special characters!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }

  // Validate author email
  if (jsonData.author === "") {
    document.getElementById("message").innerHTML = 'Author email is required!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(jsonData.author)) {
    document.getElementById("message").innerHTML = 'Please enter a valid author email!';
    document.getElementById("message").setAttribute("class", "text-danger");
    return;
  }

  var request = new XMLHttpRequest();
  request.open("POST", "/add-resource", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    response = JSON.parse(request.responseText);
    console.log(response);

    if (!response.message) {
      document.getElementById("message").innerHTML = 'Added Resource: ' + jsonData.title + '!';
      document.getElementById("message").setAttribute("class", "text-success");

      // Show success popup
      alert('Blog successfully uploaded!');

      // Clear form fields
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("author").value = "";

      // Optionally redirect after success
      window.location.href = 'index.html';
    } else {
      document.getElementById("message").innerHTML = 'Error: ' + response.message;
      document.getElementById("message").setAttribute("class", "text-danger");
    }
  };

  request.send(JSON.stringify(jsonData));
}
