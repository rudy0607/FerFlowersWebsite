const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// Clear any existing cart data
localStorage.removeItem('cart');

// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            name,
            price,
            image,
            quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showNotification('Item added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartIcon();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartIcon();
    }
}

function updateCartDisplay() {
    const cartTable = document.querySelector('#cart table tbody');
    if (!cartTable) return;

    cartTable.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;

        cartTable.innerHTML += `
            <tr>
                <td><a href="#" onclick="removeFromCart('${item.productId}')"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt=""></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" 
                           onchange="updateQuantity('${item.productId}', parseInt(this.value))">
                </td>
                <td>$${total}</td>
            </tr>
        `;
    });

    // Update cart subtotal
    const subtotalElement = document.querySelector('#subtotal table tr:first-child td:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal}`;
    }

    // Update cart total
    const totalElement = document.querySelector('#subtotal table tr:last-child td:last-child');
    if (totalElement) {
        totalElement.textContent = `$${subtotal}`;
    }
}

function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartIcon();
});