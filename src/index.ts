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
    quantity: number
}

let orderTotal = 0
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

function renderMenu() {

    const menuInnerHtml = menu.map((menuItem) => {
        return `
        <div class="menu-items">
            <img alt=${menuItem.alt} src=${menuItem.image} />
                <div class="item">
                    <h2> ${menuItem.name} </h2>
                    <p> ${menuItem.ingredients} </p>
                    <p> $${menuItem.price} </p>
                </div>
            <button class="add-btn" data-name=${menuItem.name} data-price=${menuItem.price}> + </button>
        </div>
        `
    }).join("")


    menuRoot.innerHTML = menuInnerHtml
    console.log(menu)
}

menuRoot.addEventListener("click", function (e) {
    const target = e.target as HTMLElement
    if (target && target.classList.contains("add-btn")) {
        const cartItemName = target.dataset.name
        const cartItemPrice = target.dataset.price
        console.log(cartItemPrice, cartItemName)
        if (cartItemName === undefined) {
            return console.error("Item does not exist")
        } else {
            const selectedItem = menu.find((item) => item.name === cartItemName)
            if (selectedItem === undefined) {
                return
            }
            const index = cart.findIndex(item => item.menuItem.id === selectedItem.id)
            console.log(index)
            if (index > -1) {
                cart[index].quantity++
            } else {
                cart.push({
                    id: nextOrderId++,
                    menuItem: selectedItem,
                    quantity: 1
                })
            }
            console.log(cart)
        }
    }
})


renderMenu()
