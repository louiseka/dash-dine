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
        ingredients: ["pepperoni", "mushroom", "mozarella"],
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
        <li class="py-8 px-0 flex justify-between border-b border-gray-200">
            <img alt="${menuItem.alt}" src=${menuItem.image} />
                <div class="w-[70%]">
                    <p class="text-lg font-medium"> ${menuItem.name} </p> 
                    <p class="text-xs"> ${menuItem.ingredients} </p>
                    <p> £${menuItem.price} </p>
                </div>
            <button 
                class="add-btn text-gray-500 text-2xl w-[50px] h-[50px] my-auto mx-0 rounded-full border border-[#dedede]" 
                aria-label="Add ${menuItem.name} to cart"
                data-name=${menuItem.name} 
                data-price=${menuItem.price}> 
                    <i class="fa-solid fa-plus"></i> 
            </button>
        </li>
        `
    }).join("")

    menuRoot.innerHTML = `
    <h2 class="pt-6 pl-2 text-2xl font-medium"> Our Menu</h2>
         <p class="pl-2 pb-4"> At Dash and Dine, we believe in getting the basics just right. Take your
            pick from the menu below: </p>
         <ul> 
            ${menuInnerHtml}   
         </ul>
    `
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

    const cartItemsContainer = document.getElementById("cart-items")!
    const cartSection = document.getElementById("cart-section")!

    if (cart.length === 0) {
        cartSection.classList.add("hidden")
        cartSection.classList.add("hidden")
        return
    }

    const cartInnerHtml = cart.map((cartItem: Order) => {
        return `
        <li class="flex justify-between pt-0 px-0 pb-2">
        <div class="flex items-center">
            <p class="text-2xl text-lg font-normal pl-2"> 
                <span class="text-lg"> ${cartItem.quantity}x </span> 
                 ${cartItem.menuItem.name} 
            </p>
            <div class="pl-5">
                <button class="add-item-btn text-[#0E0E0E] text-lg  my-auto mx-0 " aria-label="Add one more ${cartItem.menuItem.name}" data-id="${cartItem.id}"> <i class="fa-solid fa-circle-plus"></i> </button> 
                <button class="remove-item-btn text-[#0E0E0E] text-lg my-auto mx-0 " aria-label="Remove one ${cartItem.menuItem.name}" data-id="${cartItem.id}"> <i class="fa-solid fa-circle-minus"></i> </button> 
            </div>
        </div>
          
            <p class="items-end "> £${cartItem.price} </p>
       
    </li>        
        `
    }).join("")
    cartItemsContainer.innerHTML = `
    <ul> 
    ${cartInnerHtml}
    </ul>
    `
    document.getElementById("cart-total-price")!.textContent = "£" + getCartTotal()
    cartSection.classList.remove("hidden")
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
        payModal.classList.remove("hidden")
        payModal.classList.add("block")
        document.getElementById("name")!.focus()
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !payModal.classList.contains("hidden")) {
        payModal.classList.add("hidden")
        document.getElementById("complete-order-btn")!.focus()
    }
})

document.getElementById("close-pay-modal")!.addEventListener("click", () => {
    payModal.classList.remove("block")
    payModal.classList.add("hidden")
    document.getElementById("complete-order-btn")!.focus()
})

paymentDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const paymentFormData = new FormData(paymentDetailsForm)
    const orderName = paymentFormData.get('name')

    payModal.classList.remove("block")
    payModal.classList.add("hidden")

    document.getElementById("cart-section")!.classList.add("hidden")

    menuRoot.style.display = "none"
    document.getElementById("order-confirmation")!.classList.remove("hidden")
    document.getElementById("order-confirmation")!.classList.add("block")
    document.getElementById("order-confirmation")!.innerHTML = `
        <p> Thanks, ${orderName}. Your order is on its way!</p>
    `
})

renderMenu()

