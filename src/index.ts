type MenuItem = {
    name: string
    ingredients: string[]
    price: number
    alt: string
    image: string
    id: number
}

type Order = {
    id: number
    menuItem: MenuItem
    quantity: number
    price: number
}

let nextOrderId = 1
let nextMenuItemId = 1

const menu: MenuItem[] = [
    {
        name: 'Pizza',
        ingredients: ['pepperoni', 'mushroom', 'mozarella'],
        price: 14,
        alt: 'Graphic of a slice of pizza',
        image: './pizza-graphic.png',
        id: nextMenuItemId++,
    },
    {
        name: 'Hamburger',
        ingredients: ['beef', 'cheese', 'lettuce'],
        price: 12,
        alt: 'Graphic of a hamburger',
        image: './burger-graphic.png',
        id: nextMenuItemId++,
    },
    {
        name: 'Beer',
        ingredients: ['grain, hops, yeast, water'],
        price: 12,
        alt: 'Graphic of a beer in a pint glass',
        image: './beer-graphic.png',
        id: nextMenuItemId++,
    },
]

const cart: Order[] = []

const menuRoot = document.getElementById('menu-root')!
const cartRoot = document.getElementById('cart-root')!
const payModal = document.getElementById('pay-modal')!
const paymentDetailsForm = document.getElementById(
    'payment-details-form',
) as HTMLFormElement
const completeOrderBtn = document.getElementById('complete-order-btn')!
const orderConfirmation = document.getElementById('order-confirmation')!
const cartSection = document.getElementById('cart-section')!

function renderMenu() {
    const heading = document.createElement('h2')
    heading.className = 'pt-6 pl-2 text-2xl font-medium'
    heading.textContent = 'Our Menu'

    const intro = document.createElement('p')
    intro.className = 'pl-2 pb-4'
    intro.textContent =
        'At Dash and Dine, we believe in getting the basics just right. Take your pick from the menu below:'

    const list = document.createElement('ul')

    for (const menuItem of menu) {
        const listItem = document.createElement('li')
        listItem.className =
            'py-8 px-0 flex justify-between border-b border-line'

        const image = document.createElement('img')
        image.alt = menuItem.alt
        image.src = menuItem.image

        const details = document.createElement('div')
        details.className = 'w-[70%]'

        const name = document.createElement('p')
        name.className = 'text-lg font-medium'
        name.textContent = menuItem.name

        const ingredients = document.createElement('p')
        ingredients.className = 'text-xs'
        ingredients.textContent = menuItem.ingredients.join(',')

        const price = document.createElement('p')
        price.textContent = `£${menuItem.price}`

        details.append(name, ingredients, price)

        const addButton = document.createElement('button')
        addButton.className =
            'add-btn text-muted text-2xl w-[50px] h-[50px] my-auto mx-0 rounded-full border border-line cursor-pointer'
        addButton.setAttribute('aria-label', `Add ${menuItem.name} to cart`)
        addButton.dataset.name = menuItem.name
        addButton.dataset.price = String(menuItem.price)

        const addIcon = document.createElement('i')
        addIcon.className = 'fa-solid fa-plus'
        addButton.append(addIcon)

        listItem.append(image, details, addButton)
        list.append(listItem)
    }

    menuRoot.replaceChildren(heading, intro, list)
}

menuRoot.addEventListener('click', function (e) {
    const target = (e.target as HTMLElement).closest('.add-btn') as HTMLElement
    if (target) {
        const cartItemName = target.dataset.name
        const cartItemPrice = Number(target.dataset.price)
        if (cartItemName === undefined || isNaN(cartItemPrice)) {
            return console.error('Item does not exist')
        } else {
            const selectedItem = menu.find((item) => item.name === cartItemName)
            if (selectedItem === undefined) {
                return
            }
            const index = cart.findIndex(
                (item) => item.menuItem.id === selectedItem.id,
            )
            if (index > -1) {
                cart[index].quantity++
                cart[index].price = cart[index].price + selectedItem.price
                renderCart()
            } else {
                cart.push({
                    id: nextOrderId++,
                    menuItem: selectedItem,
                    quantity: 1,
                    price: cartItemPrice || 0,
                })
                renderCart()
            }
        }
    }
})

function getCartTotal() {
    return cart.reduce((acc, item) => acc + item.price, 0)
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items')!

    if (cart.length === 0) {
        cartSection.classList.add('hidden')
        return
    }

    const list = document.createElement('ul')

    for (const cartItem of cart) {
        const listItem = document.createElement('li')
        listItem.className = 'flex justify-between pt-0 px-0 pb-2'

        const itemInfo = document.createElement('div')
        itemInfo.className = 'flex items-center'

        const nameLine = document.createElement('p')
        nameLine.className = 'text-2xl text-lg font-normal pl-2'

        const quantitySpan = document.createElement('span')
        quantitySpan.className = 'text-lg'
        quantitySpan.textContent = `${cartItem.quantity}x`

        nameLine.append(quantitySpan, ` ${cartItem.menuItem.name}`)

        const buttonsWrapper = document.createElement('div')
        buttonsWrapper.className = 'pl-5'

        const addItemBtn = document.createElement('button')
        addItemBtn.className =
            'add-item-btn text-ink text-lg my-auto mx-0 cursor-pointer'
        addItemBtn.setAttribute(
            'aria-label',
            `Add one more ${cartItem.menuItem.name}`,
        )
        addItemBtn.dataset.id = String(cartItem.id)

        const addIcon = document.createElement('i')
        addIcon.className = 'fa-solid fa-circle-plus'
        addItemBtn.append(addIcon)

        const removeItemBtn = document.createElement('button')
        removeItemBtn.className =
            'remove-item-btn text-ink text-lg my-auto mx-0 cursor-pointer'
        removeItemBtn.setAttribute(
            'aria-label',
            `Remove one ${cartItem.menuItem.name}`,
        )
        removeItemBtn.dataset.id = String(cartItem.id)

        const removeIcon = document.createElement('i')
        removeIcon.className = 'fa-solid fa-circle-minus'
        removeItemBtn.append(removeIcon)

        buttonsWrapper.append(addItemBtn, removeItemBtn)
        itemInfo.append(nameLine, buttonsWrapper)

        const price = document.createElement('p')
        price.className = 'items-end'
        price.textContent = `£${cartItem.price}`

        listItem.append(itemInfo, price)
        list.append(listItem)
    }

    cartItemsContainer.replaceChildren(list)
    document.getElementById('cart-total-price')!.textContent =
        '£' + getCartTotal()
    cartSection.classList.remove('hidden')
}

cartRoot.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    const removeItemBtn = target.closest('.remove-item-btn') as HTMLElement
    const addItemBtn = target.closest('.add-item-btn') as HTMLElement

    if (removeItemBtn) {
        const itemId = Number(removeItemBtn.dataset.id)
        const index = cart.findIndex((item) => item.id === itemId)
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
        const index = cart.findIndex((item) => item.id == itemId)
        if (index > -1) {
            cart[index].quantity++
            cart[index].price += cart[index].menuItem.price
            renderCart()
        }
    }
})

completeOrderBtn.addEventListener('click', () => {
    if (getCartTotal() > 0) {
        payModal.classList.remove('hidden')
        payModal.classList.add('flex')
        document.getElementById('name')!.focus()
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !payModal.classList.contains('hidden')) {
        payModal.classList.remove('flex')
        payModal.classList.add('hidden')
        completeOrderBtn.focus()
    }
})

document.getElementById('close-pay-modal')!.addEventListener('click', () => {
    payModal.classList.remove('flex')
    payModal.classList.add('hidden')
    completeOrderBtn.focus()
})

paymentDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const paymentFormData = new FormData(paymentDetailsForm)
    const orderName = paymentFormData.get('name')

    payModal.classList.remove('flex')
    payModal.classList.add('hidden')

    cartSection.classList.add('hidden')

    menuRoot.style.display = 'none'
    orderConfirmation.classList.remove('hidden')
    orderConfirmation.classList.add('block')

    const confirmationMessage = document.createElement('p')
    confirmationMessage.textContent = `Thanks, ${orderName}. Your order is on its way!`
    orderConfirmation.replaceChildren(confirmationMessage)
})

const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement

function setTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark)
    themeToggle.setAttribute('aria-checked', String(isDark))
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

setTheme(document.documentElement.classList.contains('dark'))

themeToggle.addEventListener('click', () => {
    setTheme(themeToggle.getAttribute('aria-checked') !== 'true')
})

renderMenu()
