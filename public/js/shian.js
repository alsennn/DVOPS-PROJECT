// Function to delete a resource with a confirmation prompt
function deleteResource(selectedId) {
    // Confirm with the user before proceeding with deletion
    const userConfirmed = confirm("Are you sure you want to delete this resource?");
    if (!userConfirmed) {
        // If the user clicks "Cancel", exit the function
        return;
    }

    // Create an XMLHttpRequest to send the DELETE request
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-resource/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');

    // Handle the response from the server
    request.onload = function () {
        try {
            var response = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 300) {
                if (response.message === "Resource deleted successfully!") {
                    alert('Resource deleted successfully!');
                    // Refresh the page or redirect to ensure the updated list is shown
                    window.location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Unable to delete resource! Error: ' + response.message);
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            alert('An unexpected error occurred.');
        }
    };

    // Handle any errors with the request itself
    request.onerror = function () {
        alert('An error occurred while trying to delete the blog.');
    };

    // Send the DELETE request
    request.send();
}
