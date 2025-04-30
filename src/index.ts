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
    status: string
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

const orderQueue: Order[] = []

function renderMenu() {

    const menuInnerHtml = menu.map((menuItem) => {
        return `
        <div class="menu-items">
            <img alt=${menuItem.alt} src=${menuItem.image} />
                <div class="item">
                    <h2> ${menuItem.name} </h2>
                    <p> ${menuItem.ingredients} </p>
                    <p> ${menuItem.price} </p>
                </div>
            <button class="add-btn"> + </button>
        </div>
        `
    }).join("")

    const menuRoot = document.getElementById("menu-root")!
    menuRoot.innerHTML = menuInnerHtml
    console.log(menu)
}

renderMenu()