function addResource() {
  var jsonData = new Object();
  jsonData.title = document.getElementById("title").value.trim();
  jsonData.description = document.getElementById("description").value.trim();
  jsonData.author = document.getElementById("author").value.trim();

  var request = new XMLHttpRequest();
  request.open("POST", "/add-resource", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    var response = JSON.parse(request.responseText);
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
