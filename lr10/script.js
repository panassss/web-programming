document.addEventListener('DOMContentLoaded', () => {
    function getStoredCart() {
        const stored = localStorage.getItem('user_cart_lr10');
        return stored ? JSON.parse(stored) : [];
    }

    function saveStoredCart(cart) {
        localStorage.setItem('user_cart_lr10', JSON.stringify(cart));
        refreshCartBadge();
    }

    function refreshCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const cart = getStoredCart();
            badge.textContent = cart.length;
        }
    }

    refreshCartBadge();

    function openModal(el) { if (el) el.style.display = 'flex'; }
    function closeModal(el) { if (el) el.style.display = 'none'; }

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal-backdrop'));
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal(e.target);
        }
    });

    const cartIconBtn = document.getElementById('cart-icon-btn');
    const modalEmpty = document.getElementById('modal-empty');
    const modalSelectQty = document.getElementById('modal-select-qty');
    const modalAddedStatus = document.getElementById('modal-added-status');

    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', () => {
            const cart = getStoredCart();
            if (cart.length === 0) {
                openModal(modalEmpty);
            } else {
                window.location.href = 'cart.html';
            }
        });

        let selectedItem = null;
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-column');
                selectedItem = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: parseFloat(card.dataset.price)
                };
                document.getElementById('qty-field').value = 1;
                openModal(modalSelectQty);
            });
        });

        const submitAddBtn = document.getElementById('btn-submit-add');
        if (submitAddBtn) {
            submitAddBtn.addEventListener('click', () => {
                const qtyVal = parseInt(document.getElementById('qty-field').value, 10);
                if (isNaN(qtyVal) || qtyVal <= 0) {
                    alert('Вкажіть дійсну кількість');
                    return;
                }

                let cart = getStoredCart();
                const found = cart.find(i => i.id === selectedItem.id);
                if (found) {
                    found.qty += qtyVal;
                } else {
                    cart.push({ ...selectedItem, qty: qtyVal });
                }

                saveStoredCart(cart);
                closeModal(modalSelectQty);
                openModal(modalAddedStatus);
            });
        }

        const openCartBtn = document.getElementById('btn-open-cart');
        if (openCartBtn) {
            openCartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }

        const continueShopBtn = document.getElementById('btn-continue-shop');
        if (continueShopBtn) {
            continueShopBtn.addEventListener('click', () => {
                closeModal(modalAddedStatus);
            });
        }
    }

    const cartItemsBody = document.getElementById('cart-items-body');
    const overallSum = document.getElementById('overall-sum');
    const modalChangeQty = document.getElementById('modal-change-qty');
    const editQtyField = document.getElementById('edit-qty-field');
    const submitEditBtn = document.getElementById('btn-submit-edit');
    let editTargetId = null;

    function renderCartTable() {
        if (!cartItemsBody) return;

        const cart = getStoredCart();
        cartItemsBody.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 25px;">Корзина пуста</td></tr>';
            if (overallSum) overallSum.textContent = '0.00 грн.';
            return;
        }

        cart.forEach((item, index) => {
            const sum = item.price * item.qty;
            total += sum;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}.</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                    ${item.qty} 
                    <span class="link-action edit-item-btn" data-id="${item.id}">(змінити к-сть)</span>
                    <br>
                    <span class="link-action link-delete delete-item-btn" data-id="${item.id}">(видалити)</span>
                </td>
                <td>${sum.toFixed(2)}</td>
            `;
            cartItemsBody.appendChild(tr);
        });

        if (overallSum) overallSum.textContent = `${total.toFixed(2)} грн.`;

        document.querySelectorAll('.edit-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const itm = cart.find(x => x.id === id);
                if (itm) {
                    editTargetId = id;
                    editQtyField.value = itm.qty;
                    openModal(modalChangeQty);
                }
            });
        });

        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                let updated = getStoredCart().filter(x => x.id !== id);
                saveStoredCart(updated);
                renderCartTable();
            });
        });
    }

    if (submitEditBtn) {
        submitEditBtn.addEventListener('click', () => {
            const newCount = parseInt(editQtyField.value, 10);
            if (isNaN(newCount) || newCount <= 0) {
                alert('Введіть коректне число');
                return;
            }

            let cart = getStoredCart();
            const itm = cart.find(x => x.id === editTargetId);
            if (itm) {
                itm.qty = newCount;
                saveStoredCart(cart);
                closeModal(modalChangeQty);
                renderCartTable();
            }
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getStoredCart();
            if (cart.length === 0) {
                alert('Корзина порожня!');
                return;
            }
            alert('Дякуємо за замовлення! Оплату проведено успішно.');
            localStorage.removeItem('user_cart_lr10');
            renderCartTable();
        });
    }

    renderCartTable();
});