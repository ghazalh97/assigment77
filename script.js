// Global variables to store user data and order information
let currentUser = null
let currentOrder = null

// Coffee prices
const coffeePrices = {
  espresso: 2.5,
  latte: 3.5,
  cappuccino: 4.0,
}

// DOM elements
const loginSection = document.getElementById("loginSection")
const orderSection = document.getElementById("orderSection")
const billSection = document.getElementById("billSection")
const loginForm = document.getElementById("loginForm")
const orderForm = document.getElementById("orderForm")
const billForm = document.getElementById("billForm")
const welcomeMessage = document.getElementById("welcomeMessage")
const userRole = document.getElementById("userRole")
const orderSummary = document.getElementById("orderSummary")
const finalBill = document.getElementById("finalBill")
const newOrderBtn = document.getElementById("newOrderBtn")
const logoutBtn = document.getElementById("logoutBtn")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  showSection("loginSection")
  setupEventListeners()
})

// Setup all event listeners
function setupEventListeners() {
  loginForm.addEventListener("submit", handleLogin)
  orderForm.addEventListener("submit", handleOrder)
  billForm.addEventListener("submit", handleBillCalculation)
  newOrderBtn.addEventListener("click", startNewOrder)
  logoutBtn.addEventListener("click", handleLogout)
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value

  // Validate credentials
  if ((username === "admin" || username === "user") && password === "1234") {
    // Set user data
    currentUser = {
      username: username,
      role: username,
      securityLevel: username === "admin" ? "high" : "low",
    }

    // Update UI
    welcomeMessage.textContent = `Welcome, ${username}!`
    userRole.textContent = `${username} (${currentUser.securityLevel} security)`
    userRole.className = `role-badge ${username}`

    // Show success message
    alert(`Login successful! Welcome ${username}.\nSecurity Level: ${currentUser.securityLevel}`)

    // Move to order section
    showSection("orderSection")

    // Clear login form
    loginForm.reset()
  } else {
    alert("Invalid credentials! Please use:\nUsername: admin or user\nPassword: 1234")
  }
}

// Handle order form submission
function handleOrder(e) {
  e.preventDefault()

  const customerName = document.getElementById("customerName").value.trim()
  const customerAge = Number.parseInt(document.getElementById("customerAge").value)
  const coffeeType = document.getElementById("coffeeType").value
  const quantity = Number.parseInt(document.getElementById("quantity").value)

  // Calculate order
  const pricePerCup = coffeePrices[coffeeType]
  const originalTotal = pricePerCup * quantity

  // Apply discount for age < 18 or > 60
  const isEligibleForDiscount = customerAge < 18 || customerAge > 60
  const discountAmount = isEligibleForDiscount ? originalTotal * 0.1 : 0
  const totalAfterDiscount = originalTotal - discountAmount

  // Store order data
  currentOrder = {
    customerName,
    customerAge,
    coffeeType,
    quantity,
    pricePerCup,
    originalTotal,
    discountAmount,
    totalAfterDiscount,
    isEligibleForDiscount,
  }

  // Display order summary
  displayOrderSummary()

  // Show success message
  alert(
    `Order calculated successfully for ${customerName}!\nOriginal Total: $${originalTotal.toFixed(2)}\nDiscount: $${discountAmount.toFixed(2)}\nTotal: $${totalAfterDiscount.toFixed(2)}`,
  )

  // Move to bill section
  showSection("billSection")
}

// Display order summary
function displayOrderSummary() {
  const {
    customerName,
    coffeeType,
    quantity,
    originalTotal,
    discountAmount,
    totalAfterDiscount,
    isEligibleForDiscount,
  } = currentOrder

  orderSummary.innerHTML = `
        <h3>Order Summary for ${customerName}</h3>
        <p><strong>Coffee:</strong> ${quantity} ${coffeeType}(s) @ $${coffeePrices[coffeeType].toFixed(2)} each</p>
        <p><strong>Original Total:</strong> $${originalTotal.toFixed(2)}</p>
        ${
          isEligibleForDiscount
            ? `<p class="discount-applied"><strong>Discount Applied (10%):</strong> -$${discountAmount.toFixed(2)}</p>`
            : "<p><strong>No discount applied</strong></p>"
        }
        <p class="total-highlight"><strong>Subtotal:</strong> $${totalAfterDiscount.toFixed(2)}</p>
    `
}

// Handle bill calculation with tip and splitting
function handleBillCalculation(e) {
  e.preventDefault()

  const splitPeople = Number.parseInt(document.getElementById("splitPeople").value)
  const tipPercentage = Number.parseInt(document.getElementById("tipPercentage").value)

  const { totalAfterDiscount, customerName } = currentOrder

  // Calculate tip and final amounts
  const tipAmount = totalAfterDiscount * (tipPercentage / 100)
  const totalWithTip = totalAfterDiscount + tipAmount
  const amountPerPerson = totalWithTip / splitPeople

  // Display final bill
  const finalBillHTML = `
        <h3>Final Bill</h3>
        <p><strong>Hello ${customerName}!</strong></p>
        <p>You ordered ${currentOrder.quantity} ${currentOrder.coffeeType}(s).</p>
        <p><strong>Original total:</strong> $${currentOrder.originalTotal.toFixed(2)}</p>
        ${
          currentOrder.isEligibleForDiscount
            ? `<p class="discount-applied"><strong>Discount:</strong> $${currentOrder.discountAmount.toFixed(2)}</p>`
            : ""
        }
        <p><strong>Subtotal:</strong> $${totalAfterDiscount.toFixed(2)}</p>
        <p><strong>Tip (${tipPercentage}%):</strong> $${tipAmount.toFixed(2)}</p>
        <p class="total-highlight"><strong>Total with Tip:</strong> $${totalWithTip.toFixed(2)}</p>
        <p class="total-highlight"><strong>Split between ${splitPeople} ${splitPeople === 1 ? "person" : "people"}:</strong> $${amountPerPerson.toFixed(2)} each</p>
    `

  finalBill.innerHTML = finalBillHTML

  // Show the final bill alert
  alert(
    `Hello ${customerName}!\nYou ordered ${currentOrder.quantity} ${currentOrder.coffeeType}(s).\nOriginal total: $${currentOrder.originalTotal.toFixed(2)}\nDiscount: $${currentOrder.discountAmount.toFixed(2)}\nTip: $${tipAmount.toFixed(2)}\nTotal with Tip: $${totalWithTip.toFixed(2)}\nSplit between ${splitPeople} people: $${amountPerPerson.toFixed(2)} each`,
  )

  // Show new order button
  newOrderBtn.style.display = "inline-block"
}

// Start a new order
function startNewOrder() {
  currentOrder = null
  orderForm.reset()
  billForm.reset()
  finalBill.innerHTML = ""
  newOrderBtn.style.display = "none"
  showSection("orderSection")
}

// Handle logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    currentUser = null
    currentOrder = null

    // Reset all forms
    loginForm.reset()
    orderForm.reset()
    billForm.reset()

    // Clear displays
    orderSummary.innerHTML = ""
    finalBill.innerHTML = ""
    newOrderBtn.style.display = "none"

    // Show login section
    showSection("loginSection")

    alert("You have been logged out successfully!")
  }
}

// Utility function to show specific section
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show the requested section
  document.getElementById(sectionId).classList.add("active")
}

// Additional utility functions for enhanced user experience
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Add some interactive feedback
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add focus effects to inputs
  document.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)"
    })
  })
})

console.log("Café Ghazaleh Smart Coffee Assistant loaded successfully!")
console.log("Valid credentials: admin/user with password: 1234")
