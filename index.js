//Import data.js
import { menuArray } from "./data.js"

const menuRoot = document.getElementById("menu-root")
const cartRoot = document.getElementById("cart-root")
const cartTotalPrice = document.getElementById("cart-total-price")
const completeOrderBtn = document.getElementById("complete-order-btn")
const payModal = document.getElementById("pay-modal")
const paymentDetailsForm = document.getElementById("payment-details-form")
const orderConfirmation = document.getElementById("order-confirmation")
const cartSection = document.getElementById("cart-section")


//Render menu items onto the page

function makeItem(itemImage, itemAlt, itemName, itemIngredients, itemPrice) {

    const image = document.createElement('img')
    image.classList.add('food-graphic')
    image.src = itemImage
    image.alt = itemAlt

    const name = document.createElement('h2')
    name.textContent = itemName

    const ingredients = document.createElement('p')
    ingredients.classList.add('ingredients-text')
    ingredients.textContent = itemIngredients

    const price = document.createElement('p')
    price.classList.add('price')
    price.textContent = "$" + itemPrice

    const addBtn = document.createElement('button')
    addBtn.classList.add('add-btn')
    addBtn.textContent = "+"
    addBtn.dataset.itemName = itemName
    addBtn.dataset.itemPrice = itemPrice

    const itemDiv = document.createElement('div')
    itemDiv.classList.add('item')
    itemDiv.appendChild(name)
    itemDiv.appendChild(ingredients)
    itemDiv.appendChild(price)

    const menuSection = document.createElement('section')
    menuSection.classList.add('menu-items')
    menuSection.appendChild(image)
    menuSection.appendChild(itemDiv)
    menuSection.appendChild(addBtn)

    return menuSection

}

function makeMenuItem(menu) {
    const item = makeItem(menu.image, menu.alt, menu.name, menu.ingredients, menu.price)
    return item
}


//Add button adds item to cart

const cart = {
}

document.addEventListener("click", function (e) {
    if (e.target.dataset.itemName) {
        const cartItemName = e.target.dataset.itemName
        const cartItemPrice = e.target.dataset.itemPrice
        if (cart[cartItemName] === undefined) {
            cart[cartItemName] = {
                quantity: 1,
                price: cartItemPrice
            }
        } else {
            cart[cartItemName].quantity += 1
        }
        renderCart(Object.entries(cart))
    }
})

function renderCart(items) {

    cartRoot.innerHTML = ''

    const cartArray = []
    items.forEach(function (item) {
        const name = item[0]
        const price = item[1].price
        const quantity = item[1].quantity

        const rowTotal = price * quantity

        const cartItemRemove = document.createElement('a')
        cartItemRemove.textContent = " remove"
        cartItemRemove.href = '#'
        cartItemRemove.addEventListener("click", function () {

            delete cart[name]

            renderCart(Object.entries(cart))
        })

        const cartItemRemoveSpan = document.createElement('span')
        cartItemRemoveSpan.appendChild(cartItemRemove)

        const cartItemName = document.createElement('p')
        cartItemName.classList.add('item-name')
        cartItemName.textContent = name
        cartItemName.appendChild(cartItemRemoveSpan)

        const cartItemPrice = document.createElement('p')
        cartItemPrice.classList.add('price')
        cartItemPrice.textContent = "$" + rowTotal

        const cartContainer = document.createElement('div')
        cartContainer.classList.add('cart-item')
        cartContainer.appendChild(cartItemName)
        cartContainer.appendChild(cartItemPrice)

        cartArray.push(cartContainer)

    })

    cartTotalPrice.textContent = "$" + getCartTotal()

    cartRoot.append(...cartArray)
}

function getCartTotal() {
    const cartValues = Object.values(cart)
    let total = 0
    cartValues.forEach(function (cartValue) {
        total += cartValue.quantity * cartValue.price
    })
    return total
}

completeOrderBtn.addEventListener("click", function () {

    if (getCartTotal() > 0) {
        payModal.style.display = 'block'
    }
})

paymentDetailsForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const paymentFormData = new FormData(paymentDetailsForm)

    payModal.style.display = 'none'
    cartSection.style.display = 'none'

    orderConfirmation.style.display = 'block'


    const orderName = paymentFormData.get('name')

    orderConfirmation.innerHTML = `<p> Thanks, ${orderName} Your order is on its way!</p>`

})

function renderMenu() {
    const menuItemList = []
    menuArray.forEach(function (menuItem) {
        menuItemList.push(makeMenuItem(menuItem))
    })

    menuRoot.append(...menuItemList)
}

renderMenu()