console.log("Hello King Capstone!");

// Menu data will come from menu.json.
let menuItems = [];
let currentIndex = 0;
let filteredItems = [];

// Format prices as US dollars.
const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

// Load the menu data.
async function loadMenu() {
    try {
        const response = await fetch("menu.json");

        if (!response.ok) {
            throw new Error("Could not load menu.json");
        }

        menuItems = await response.json();
        filteredItems = menuItems;
        currentIndex = 0;

        if (menuItems.length === 0) {
            throw new Error("The menu is empty.");
        }

        displayMenu();

        document.getElementById("prevButton").disabled = false;
        document.getElementById("nextButton").disabled = false;
    } catch (error) {
        console.error(error);

        document.getElementById("menuName").textContent =
            "The menu could not be loaded.";
    }
}

// Display one menu item.
function displayMenu() {
    const item = filteredItems[currentIndex];

    if (!item) {
        return;
    }

    document.getElementById("menuName").textContent = item.name;

    document.getElementById("menuName").textContent = item.name;

    document.getElementById("menuDescription").textContent =
        item.description;

    document.getElementById("menuPrice").textContent =
        money.format(item.price);

    document.getElementById("menuNote").textContent =
        item.note || "";

    const image = document.getElementById("menuImage");

    // Show the image when the item has an image path.
    if (item.img) {
        image.src = item.img;
        image.alt = item.name;
        image.hidden = false;
    } else {
        image.hidden = true;
        image.removeAttribute("src");
    }
}

function prevImage() {
    if (filteredItems.length === 0) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = filteredItems.length - 1;
    }

    displayMenu();
}

function nextImage() {
    if (filteredItems.length === 0) return;

    currentIndex++;

    if (currentIndex >= filteredItems.length) {
        currentIndex = 0;
    }

    displayMenu();
}

function filterMenu() {
    const category = document.getElementById("menuFilter").value;

    if (category === "All") {
        filteredItems = menuItems;
    } else {
        filteredItems = menuItems.filter(function (item) {
            return item.category === category;
        });
    }

    currentIndex = 0;

    const isEmpty = filteredItems.length === 0;

    document.getElementById("prevButton").disabled = isEmpty;
    document.getElementById("nextButton").disabled = isEmpty;

    if (isEmpty) {
        document.getElementById("menuName").textContent =
            "No items in this category.";

        document.getElementById("menuDescription").textContent = "";
        document.getElementById("menuPrice").textContent = "";
        document.getElementById("menuNote").textContent = "";
        document.getElementById("menuImage").hidden = true;
        return;
    }

    displayMenu();
}

document.addEventListener("DOMContentLoaded", function () {

    // Mobile navbar on every page.
    const navbarButton = document.querySelector(".navbar-toggler");
    const navbarLinks = document.getElementById("navbarNav");

    if (navbarButton && navbarLinks) {
        navbarButton.addEventListener("click", function () {
            const isOpen = navbarLinks.classList.toggle("show");

            navbarButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // Only run carousel code on the menu page.
    if (document.getElementById("menuCarousel")) {
        const prevButton = document.getElementById("prevButton");
        const nextButton = document.getElementById("nextButton");

        document.getElementById("menuFilter")
            .addEventListener("change", filterMenu);


        // Wait until the menu data is loaded.
        prevButton.disabled = true;
        nextButton.disabled = true;

        prevButton.addEventListener("click", prevImage);
        nextButton.addEventListener("click", nextImage);

        loadMenu();
    }

    // Reservation page.
    const reservationForm =
        document.getElementById("reservationForm");

    if (reservationForm) {
        reservationForm.addEventListener(
            "submit",
            validateReservation
        );
    }


    // Cow roundup game — only runs on the error page.
    // Hungry Longhorn game — only runs on the error page.
    const canvas = document.getElementById("cowCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        const startButton = document.getElementById("startCowGame");
        const pauseButton = document.getElementById("pauseCowGame");
        const status = document.getElementById("gameStatus");

        const cellSize = 20;
        const gridSize = canvas.width / cellSize;

        let herd = [];
        let hay = null;
        let direction = { x: 1, y: 0 };
        let nextDirection = { x: 1, y: 0 };
        let turnQueued = false;
        let score = 0;
        let timer = null;
        let playing = false;
        let paused = false;

        function placeHay() {
            // Find every square that is not occupied by the herd.
            const emptySquares = [];

            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const occupied = herd.some(function (cow) {
                        return cow.x === x && cow.y === y;
                    });

                    if (!occupied) {
                        emptySquares.push({ x: x, y: y });
                    }
                }
            }

            if (emptySquares.length === 0) {
                hay = null;
                return false;
            }

            const randomIndex =
                Math.floor(Math.random() * emptySquares.length);

            hay = emptySquares[randomIndex];
            return true;
        }

        function drawGame() {
            ctx.fillStyle = "#20291c";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the hay bale.
            if (hay) {
                const x = hay.x * cellSize;
                const y = hay.y * cellSize;

                ctx.fillStyle = "#e9bd58";
                ctx.fillRect(x + 2, y + 3, 16, 14);

                ctx.fillStyle = "#8b6528";
                ctx.fillRect(x + 6, y + 3, 2, 14);
                ctx.fillRect(x + 12, y + 3, 2, 14);
            }

            // Draw the herd behind the leading cow.
            herd.forEach(function (cow, index) {
                if (index === 0) return;

                const x = cow.x * cellSize;
                const y = cow.y * cellSize;

                ctx.fillStyle = "#f4eee6";
                ctx.fillRect(x + 1, y + 1, 18, 18);

                ctx.fillStyle = "#61402b";
                ctx.fillRect(x + 5, y + 5, 7, 6);
            });

            // Draw the leading cow.
            if (herd.length > 0) {
                ctx.font = "19px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(
                    "🐮",
                    herd[0].x * cellSize + cellSize / 2,
                    herd[0].y * cellSize + cellSize / 2
                );
            }
        }

        function endGame(message) {
            clearInterval(timer);
            timer = null;
            playing = false;
            paused = false;

            pauseButton.disabled = true;
            pauseButton.textContent = "Pause";
            startButton.textContent = "Play Again";

            status.textContent =
                message + " Hay collected: " + score + ".";
        }

        function moveHerd() {
            direction = nextDirection;
            turnQueued = false;

            const head = {
                x: herd[0].x + direction.x,
                y: herd[0].y + direction.y
            };

            // Check the pasture fence.
            if (
                head.x < 0 ||
                head.y < 0 ||
                head.x >= gridSize ||
                head.y >= gridSize
            ) {
                endGame("Fence found. Page still missing.");
                return;
            }

            const eating = head.x === hay.x && head.y === hay.y;

            // The last square becomes empty unless we are growing.
            const bodyToCheck = eating ? herd : herd.slice(0, -1);

            const hitHerd = bodyToCheck.some(function (cow) {
                return cow.x === head.x && cow.y === head.y;
            });

            if (hitHerd) {
                endGame("An udderly avoidable traffic jam!");
                return;
            }

            herd.unshift(head);

            if (eating) {
                score++;

                if (!placeHay()) {
                    drawGame();
                    endGame("You filled the pasture. Legendary moo-ves!");
                    return;
                }

                status.textContent = "Hay collected: " + score;
            } else {
                herd.pop();
            }

            drawGame();
        }

        function startGame() {
            // Prevent multiple game timers when restarting.
            clearInterval(timer);

            herd = [
                { x: 5, y: 10 },
                { x: 4, y: 10 },
                { x: 3, y: 10 }
            ];

            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            turnQueued = false;
            score = 0;
            playing = true;
            paused = false;

            placeHay();
            drawGame();

            status.textContent = "Hay collected: 0. Time to moo-ve!";
            startButton.textContent = "Restart Game";
            pauseButton.textContent = "Pause";
            pauseButton.disabled = false;

            timer = setInterval(moveHerd, 180);
        }

        function changeDirection(name) {
            if (!playing || paused || turnQueued) return;

            const directions = {
                up: { x: 0, y: -1 },
                down: { x: 0, y: 1 },
                left: { x: -1, y: 0 },
                right: { x: 1, y: 0 }
            };

            const chosen = directions[name];

            // Prevent turning directly backward into the herd.
            if (
                chosen.x === -direction.x &&
                chosen.y === -direction.y
            ) {
                return;
            }

            nextDirection = chosen;
            turnQueued = true;
        }

        function togglePause() {
            if (!playing) return;

            paused = !paused;

            if (paused) {
                clearInterval(timer);
                timer = null;
                pauseButton.textContent = "Resume";
                status.textContent = "Grazing break. Hay collected: " + score;
            } else {
                timer = setInterval(moveHerd, 180);
                pauseButton.textContent = "Pause";
                status.textContent = "Hay collected: " + score;
            }
        }

        startButton.addEventListener("click", startGame);
        pauseButton.addEventListener("click", togglePause);

        document.querySelectorAll("[data-direction]").forEach(function (button) {
            button.addEventListener("click", function () {
                changeDirection(button.dataset.direction);
            });
        });

        document.addEventListener("keydown", function (event) {
            const keys = {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right"
            };

            if (playing && !paused && keys[event.key]) {
                event.preventDefault();
                changeDirection(keys[event.key]);
            }
        });

        // Pause when the player switches tabs.
        document.addEventListener("visibilitychange", function () {
            if (document.hidden && playing && !paused) {
                togglePause();
            }
        });

        drawGame();
    }


});




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


// Success alert
        message.className = "alert alert-success";
        message.replaceChildren();

        const heading = document.createElement("strong");
        heading.textContent = "Reservation request submitted successfully!";
        message.appendChild(heading);

        const details = [
            "Name: " + reservation.name,
            "Email: " + reservation.email,
            "Party Size: " + reservation.partySize,
            "Date: " + reservation.date,
            "Time: " + reservation.time,
            "Seating: " + reservation.seating,
            "Dietary Notes: " + (reservation.dietaryNotes || "None"),
            "Newsletter: " + (reservation.newsletter ? "Yes" : "No")
        ];

        details.forEach(function (detail) {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            message.appendChild(paragraph);
        });


        event.target.reset();



};