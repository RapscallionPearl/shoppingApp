import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-c6b9c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    // add item to database
    push(shoppingListInDB, inputValue)
    // Log to console for debugging
    console.log(`${inputValue} added to database`)
    // Clear input field after adding item
    clearinputFieldEl()

})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
         // Clear the shopping list before adding new items
        clarshoppingListEl()
        // Loop through the items array and add each item to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i] // Each item is an array where the first element is the ID and the second element is the value
            let currentItemID = currentItem[0] // The first element is the ID
            let currentItemValue = currentItem[1] // The second element is the value
            addItemToShoppingList(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})
function clarshoppingListEl() {
    // Clear the shopping list element, run before adding new items to prevent duplication
    shoppingListEl.innerHTML = ""
}

function clearinputFieldEl() {
    // Clear the input field element, run after adding an item to prevent duplication, and to prepare for the next input
    inputFieldEl.value = ""
}

function addItemToShoppingList(item) {
    // Add the item to the shopping list element in the DOM
    //shoppingListEl.innerHTML += `<li>${item}</li>`
    let newItemEl = document.createElement("li")
    newItemEl.textContent = item[1] // item is an array, we want the second element which is the value
    shoppingListEl.append(newItemEl)
    newItemEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${item[0]}`)
        remove(exactLocationOfItemInDB)
        console.log(`${item[1]} removed from database`)
    })
    console.log(`${item[1]} added to shopping list`)
    inputFieldEl.focus() // Focus back on the input field after adding an item
}