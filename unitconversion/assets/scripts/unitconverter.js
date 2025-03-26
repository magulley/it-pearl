
    function convert() {
        // Clear previous error messages
        document.getElementById("valueError").innerText = "";
        document.getElementById("fromError").innerText = "";
        document.getElementById("toError").innerText = "";
        document.getElementById("result").innerText = "";

        // Get the numeric value
        let FromValue = document.getElementById("FromValue").value;

        // Get the selected FromUnit
        let FromUnit = document.querySelector('input[name="FromUnit"]:checked');
        
        // Get the selected ToUnit 
        let ToUnit = document.querySelector('input[name="ToUnit"]:checked');

        let hasError = false;

        // Validate input value
        if (FromValue === "" || isNaN(FromValue)) {
            document.getElementById("valueError").innerText = "Value is required";
            hasError = true;
        }

        // Validate FromUnit selection
        if (!FromUnit) {
            document.getElementById("fromError").innerText = "From unit is required";
            hasError = true;
        } else {
            FromUnit = FromUnit.value; // Get actual value
        }

        // Validate ToUnit selection
        if (!ToUnit) {
            document.getElementById("toError").innerText = "To unit is required";
            hasError = true;
        } else {
            ToUnit = ToUnit.value; // Get actual value
        }

        // Stop function if there are errors
        if (hasError) return;

        // AJAX request
        let xhr = new XMLHttpRequest();
        let url = `https://brucebauer.info/assets/ITEC3650/unitsconversion.php?FromValue=${FromValue}&FromUnit=${FromUnit}&ToUnit=${ToUnit}`;

        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    document.getElementById("result").innerText = `Result: ${xhr.responseText}`;
                } else {
                    document.getElementById("result").innerText = "Error retrieving conversion.";
                }
            }
        };
        xhr.send();
    }

    function clearForm() {
        document.getElementById("FromValue").value = "";
        
        // Uncheck radio buttons
        let radioButtons = document.querySelectorAll('input[name="FromUnit"], input[name="ToUnit"]');
        radioButtons.forEach(radio => radio.checked = false);

        // Clear error messages and result
        document.getElementById("valueError").innerText = "";
        document.getElementById("fromError").innerText = "";
        document.getElementById("toError").innerText = "";
        document.getElementById("result").innerText = "";
    }
