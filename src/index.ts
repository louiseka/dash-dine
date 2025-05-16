type MenuItem = {
    name: string,
    ingredients: string[],
    price: number,
    alt: string,
    image: string,
    id: number
}

type Order = {
    id: number,
    menuItem: MenuItem,
    quantity: number,
    price: number
}

let nextOrderId = 1
let nextMenuItemId = 1

const menu: MenuItem[] = [
    {
        name: "Pizza",
        ingredients: ["pepperoni", "mushrom", "mozarella"],
        price: 14,
        alt: "Graphic of a slice of pizza",
        image: "./Assets/pizza-graphic.png",
        id: nextMenuItemId++
    },
    {
        name: "Hamburger",
        ingredients: ["beef", "cheese", "lettuce"],
        price: 12,
        alt: "Graphic of a hamburger",
        image: "./Assets/burger-graphic.png",
        id: nextMenuItemId++
    },
    {
        name: "Beer",
        ingredients: ["grain, hops, yeast, water"],
        price: 12,
        alt: "Graphic of a beer in a pint glass",
        image: "./Assets/beer-graphic.png",
        id: nextMenuItemId++
    }
]

const cart: Order[] = []

const menuRoot = document.getElementById("menu-root")!
const cartRoot = document.getElementById("cart-root")!
const payModal = document.getElementById("pay-modal")!
const paymentDetailsForm = document.getElementById("payment-details-form") as HTMLFormElement

function renderMenu() {
    const menuInnerHtml = menu.map((menuItem) => {
        return `
        <div class="menu-items py-12 px-0 flex justify-between border-b border-gray-200">
            <img alt="${menuItem.alt}" src=${menuItem.image} />
                <div class="w-[70%]">
                    <h2 class="text-gray-800 text-2xl"> ${menuItem.name} </h2>
                    <p> ${menuItem.ingredients} </p>
                    <p> $${menuItem.price} </p>
                </div>
            <button class="add-btn text-gray-500 text-2xl" data-name=${menuItem.name} data-price=${menuItem.price}> <i class="fa-solid fa-plus"></i> </button>
        </div>
        `
    }).join("")

    menuRoot.innerHTML = menuInnerHtml
}

menuRoot.addEventListener("click", function (e) {
    const target = (e.target as HTMLElement).closest(".add-btn") as HTMLElement
    if (target) {
        const cartItemName = target.dataset.name
        const cartItemPrice = target.dataset.price
        if (cartItemName === undefined || cartItemPrice === undefined) {
            return console.error("Item does not exist")
        } else {
            const selectedItem = menu.find((item) => item.name === cartItemName)
            if (selectedItem === undefined) {
                return
            }
            const index = cart.findIndex(item => item.menuItem.id === selectedItem.id)
            if (index > -1) {
                cart[index].quantity++
                cart[index].price = cart[index].price + selectedItem.price
                renderCart()
            } else {
                cart.push({
                    id: nextOrderId++,
                    menuItem: selectedItem,
                    quantity: 1,
                    price: parseFloat(cartItemPrice) || 0
                })
                renderCart()
            }
        }
    }
})

function getCartTotal() {
    return Object.values(cart).reduce((acc, item) => acc + item.price, 0)
}

function renderCart() {
    const cartInnerHtml = cart.map((cartItem: Order) => {
        return `
        <div class="cart-item flex justify-between pt-0 px-0 pb-2">
            <p class="item-name text-2xl"> 
            ${cartItem.menuItem.name} 
                <span> x ${cartItem.quantity} </span> 
                <span> <button class="add-item-btn" data-id="${cartItem.id}"> <i class="fa-solid fa-plus"></i> </button> </span>  
                <span> 
                    <button class="remove-item-btn" data-id="${cartItem.id}"> <i class="fa-solid fa-minus"></i> </button> 
                </span> 
            </p>
            <p class="price"> $${cartItem.price} </p>
        </div>
    </div>    
</section>        
        `
    }).join("")
    cartRoot.innerHTML = `
    <section class="py-5 px-0" id="cart-section">
    <h3 class="cart-heading text-2xl text-center pt-0 pr-0 pb-3 pl-0"> Your order</h3>
    ${cartInnerHtml}
    `
    document.getElementById("cart-total-price")!.textContent = "$" + getCartTotal()
}

cartRoot.addEventListener("click", (e) => {
    const target = e.target as HTMLElement

    const removeItemBtn = target.closest(".remove-item-btn") as HTMLElement
    const addItemBtn = target.closest(".add-item-btn") as HTMLElement

    if (removeItemBtn) {
        const itemId = Number(removeItemBtn.dataset.id)
        const index = cart.findIndex(item => item.id === itemId)
        if (index > -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--
                cart[index].price -= cart[index].menuItem.price
            } else {
                cart.splice(index, 1)
            }
            renderCart()
        }
    }
    if (addItemBtn) {
        const itemId = Number(addItemBtn.dataset.id)
        const index = cart.findIndex(item => item.id == itemId)
        if (index > -1) {
            cart[index].quantity++
            cart[index].price += cart[index].menuItem.price
            renderCart()
        }
    }
})

document.getElementById("complete-order-btn")!.addEventListener("click", () => {
    if (getCartTotal() > 0) {
        payModal.style.display = "block"
    }
})

document.getElementById("close-pay-modal")!.addEventListener("click", () => {
    payModal.style.display = "none"
})

paymentDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const paymentFormData = new FormData(paymentDetailsForm)
    const orderName = paymentFormData.get('name')
    payModal.style.display = 'none'
    document.getElementById("cart-section")!.style.display = "none"
    menuRoot.style.display = "none"
    document.getElementById("order-confirmation")!.style.display = "block"
    document.getElementById("order-confirmation")!.innerHTML = `
        <p> Thanks, ${orderName} Your order is on its way!</p>
    `
})

renderMenu()

