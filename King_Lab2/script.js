console.log("Hello King Lab2");


// menu

const MENU_ITEMS = [

    {
        id: 1,
        name: "The Copper Cut",
        description: "12 oz. Prime Ribeye, roasted garlic butter, seasonal vegetables",
        price: 58,
        category: "Dinner",
        note: "Popular"
    },

    {
        id: 2,
        name: "The Crate Filet",
        description: "8 oz. Center-Cut Filet, truffle potato purée, red wine jus",
        price: 62,
        category: "Dinner",
        note: "Chef's Favorite"
    },

    {
        id: 3,
        name: "Black Iron Strip",
        description: "14 oz. New York Strip, smoked shallot butter, asparagus",
        price: 64,
        category: "Dinner",
        note: "Signature"
    },

    {
        id: 4,
        name: "The Fire-Roasted Chicken",
        description: "Herb-marinated chicken, roasted potatoes, seasonal greens",
        price: 36,
        category: "Dinner",
        note: "Open Fire"
    },

    {
        id: 5,
        name: "Copper Garden Salad",
        description: "Charred seasonal vegetables, heirloom grains, herb vinaigrette",
        price: 28,
        category: "Lunch",
        note: "Vegan"
    },

    {
        id: 6,
        name: "The Crate Burger",
        description: "Prime beef blend, aged cheddar, caramelized onions, house fries",
        price: 26,
        category: "Lunch",
        note: "Popular"
    },

    {
        id: 7,
        name: "Peppercorn Short Rib",
        description: "Braised beef short rib, creamy polenta, peppercorn jus",
        price: 48,
        category: "Dinner",
        note: "Rich & Savory"
    },

    {
        id: 8,
        name: "Copper Crate Salmon",
        description: "Fire-roasted Atlantic salmon, lemon beurre blanc, asparagus",
        price: 42,
        category: "Dinner",
        note: "Seasonal"
    },

    {
        id: 9,
        name: "Foundry Breakfast",
        description: "Two eggs, smoked bacon, roasted potatoes, and sourdough toast",
        price: 19,
        category: "Breakfast",
        note: "Morning Favorite"
    },

    {
        id: 10,
        name: "Brassworks French Toast",
        description: "Brioche French toast, cinnamon butter, berries, and maple syrup",
        price: 17.5,
        category: "Breakfast",
        note: "Sweet"
    }

];


const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});




function displayMenu() {

    // Find the tbody on menu.html
    const menuBody = document.getElementById("menuBody");


    // If we are not on menu.html, stop the function
    if (!menuBody) {
        return;
    }


    // Go through every menu item
    MENU_ITEMS.forEach(function(item) {

        // Create a new table row
        const row = document.createElement("tr");


        // Add the CSS class
        row.classList.add("menu-item");


        // Put the menu information inside the row
        row.innerHTML = `

            <td class="dish-name">
                ${item.name}
            </td>

            <td class="dish-description">
                ${item.description}
            </td>

            <td class="dish-price">
                ${money.format(item.price)}
            </td>

            <td class="dish-notes">
                ${item.note}
            </td>

        `;


        // Add the row to the table
        menuBody.appendChild(row);

    });

}




document.addEventListener("DOMContentLoaded", function() {

    // menu page
    displayMenu();


    // reservation page
    const reservationForm =
        document.getElementById("reservationForm");


    if (reservationForm) {

        reservationForm.addEventListener(
            "submit",
            validateReservation
        );

    }

});




    // reservation form

    function validateReservation(event) {

        // stops form from submitting normally
        event.preventDefault();


        // get values from form

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const partySize = document.getElementById("party-size").value;

        const date = document.getElementById("date").value;

        const time = document.getElementById("time").value;

        const seating =
            document.querySelector('input[name="seating"]:checked');

        const dietaryNotes =
            document.getElementById("dietary-notes").value.trim();

        const newsletter =
            document.getElementById("newsletter").checked;

        const message =
            document.getElementById("reservationMessage");


        // array to hold errors

        let errors = [];


        // name validation

        if (name === "") {

            errors.push("Name is required.");

        }
        else if (name.length > 20) {

            errors.push("Name cannot be more than 20 characters.");

        }


        // email validation

        if (email === "") {

            errors.push("Email is required.");

        }
        else if (!email.includes("@")) {

            errors.push("Please enter a valid email.");

        }


        // party size validation

        if (partySize === "") {

            errors.push("Party size is required.");

        }


        // date validation

        if (date === "") {

            errors.push("Date is required.");

        }


        // time validation

        if (time === "") {

            errors.push("Time is required.");

        }


        // seating validation

        if (seating === null) {

            errors.push("Seating preference is required.");

        }


        // dietary notes validation

        if (dietaryNotes.length > 30) {

            errors.push(
                "Dietary notes cannot be more than 30 characters."
            );

        }


        // if errors were found

        if (errors.length > 0) {

            message.className = "alert alert-danger";

            message.innerHTML = `
            <strong>Please fix the following:</strong>
            <ul>
                ${errors.map(function(error) {
                return `<li>${error}</li>`;
            }).join("")}
            </ul>
        `;

            return;

        }


        // create reservation object

        const reservation = {

            name: name,
            email: email,
            partySize: partySize,
            date: date,
            time: time,
            seating: seating.value,
            dietaryNotes: dietaryNotes,
            newsletter: newsletter

        };




        console.log(reservation);


        // success alert

        message.className = "alert alert-success";

        message.innerHTML = `
        <strong>Reservation request submitted successfully!</strong>
        <br>
        Name: ${reservation.name}
        <br>
        Email: ${reservation.email}
        <br>
        Party Size: ${reservation.partySize}
        <br>
        Date: ${reservation.date}
        <br>
        Time: ${reservation.time}
        <br>
        Seating: ${reservation.seating}
        <br>
        Dietary Notes:
        ${reservation.dietaryNotes === ""
            ? "None"
            : reservation.dietaryNotes}
        <br>
        Newsletter:
        ${reservation.newsletter ? "Yes" : "No"}
    `;



};