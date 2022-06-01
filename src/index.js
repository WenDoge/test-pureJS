import { API } from './api/products.js';

let order = [];
const innerHeader = document.querySelector('.inner-header__item');
const cart = document.getElementById('cart');
const innerCart = document.getElementById('inner-cart');
const orderContainer = document.querySelector('.order-window');
const orderForm = document.getElementById('order-form');
const innerBtn = document.getElementById('inner-button');
const overlay = document.querySelector('.dark-overlay');

const deleteOrderItem = (id, cardBtn, cardOrderBtn, span) => {
	const orderIndex = order.findIndex(arr => arr.id === id);
	const cartItem = document.getElementById('inner-window' + id);
	const orderItem = document.getElementById('order-window' + id);
	innerCart.removeChild(cartItem);
	orderForm.removeChild(orderItem);
	cardOrderBtn.innerText = 'Заказать';
	cardBtn.innerText = 'В корзину';
	span.classList.toggle('ordered-text');
	order.splice(orderIndex, 1);
	if (order.length === 0) {
		innerHeader.innerText = 'Корзина Пуста :(';
		innerBtn.disabled = true;
		if (orderContainer.classList.contains('order-window_active')) {
			orderContainer.classList.toggle('order-window_active');
		}
	}
};

const deleteAllOrder = () => {
	order.map(arr => {
		innerCart.removeChild(document.getElementById('inner-window' + arr.id));
		orderForm.removeChild(document.getElementById('order-window' + arr.id));
		document.getElementById('order' + arr.id).innerText = 'Заказать';
		document.getElementById('addcart' + arr.id).innerText = 'В корзину';
		document
			.getElementById('ordered-span' + arr.id)
			.classList.toggle('ordered-text');
		innerHeader.innerText = 'Корзина Пуста :(';
		innerBtn.disabled = true;
		document.getElementById('form-input').value = '';
	});
	order = [];
};

const addToCart = (id, img, title, price, cardBtn, cardOrderBtn, span) => {
	span.classList.toggle('ordered-text');
	let cartItem = `
		<div class='inner-window' id='inner-window${id}'>
			<img src=${img} class='inner-img'></img>
			<div>
				<h4>${title}</h4>
				<span>${price}</span>
			</div>
			<button id='inner-delete${id}' class='inner-delete'>X</button>
		</div>
		`;
	innerBtn.insertAdjacentHTML('beforebegin', cartItem);
	cardBtn.innerText = 'Отменить';
	cardOrderBtn.innerText = 'Проверить заказ';
	innerBtn.disabled = false;
	document
		.getElementById('inner-delete' + id)
		.addEventListener('click', () =>
			deleteOrderItem(id, cardBtn, cardOrderBtn, span)
		);
	if ((innerHeader.innerText = 'Корзина Пуста :(')) {
		innerHeader.innerText = 'Вы добавили в корзину:';
	}
	const orderFooter = document.getElementById('form-footer');
	const orderItem = `
		<div class='inner-window inner-order ' id='order-window${id}'>
			<div class='order-header'>
				<h3>${title}</h3>
				<button id='inner-window-delete${id}' class='inner-delete' type='button'>X</button>
			</div>
			<div class='order-content-wrapper'>
				<div class='order-img-wrapper'>
					<img src=${img} class='order-window-img'></img>
					<span>${price}</span>
				</div>
				<div class='order-comment-wrapper'>
					<textarea id='textarea' placeholder='...'></textarea>
					<label for='form-textarea'>Комментарий:</label>
				</div>
			</div>
		</div>
	`;
	orderFooter.insertAdjacentHTML('beforebegin', orderItem);
	document
		.getElementById('inner-window-delete' + id)
		.addEventListener('click', () =>
			deleteOrderItem(id, cardBtn, cardOrderBtn, span)
		);
};

const makeOrder = (id, img, title, price, cardBtn, cardOrderBtn, span) => {
	orderContainer.classList.toggle('order-window_active');
	overlay.classList.toggle('dark-overlay_active');
	addToCart(id, img, title, price, cardBtn, cardOrderBtn, span);
};

API.products.map(({ id, title, price, img }) => {
	const formatedPrice =
		price
			.toString()
			.split('')
			.reverse()
			.map((el, index) => (index % 3 !== 2 ? el : ` ${el}`))
			.reverse()
			.join('') + ' руб.';
	let item = document.createElement('div');
	item.className = 'listing';
	const imgPath = 'src/' + img;
	item.innerHTML = `
      <img class='listing__img' src=${imgPath} alt='list__item'></img>
      <div class='listing-description'>
         <h3>${title}</h3>
         <span>${formatedPrice}</span>
      </div>
      <div class='button-group'>
         <button id='order${id}' class='button button-group__item order-button'>Заказать</button>
         <button id='addcart${id}' class='button button-group__item'>В корзину</button>
			<span id='ordered-span${id}' class='order-span'>В корзине ☑</span>
      </div>`;

	document.querySelector('.product-listing-wrapper').appendChild(item);
	const cardOrderBtn = document.getElementById('order' + id);
	const cardAddBtn = document.getElementById('addcart' + id);
	const span = document.getElementById('ordered-span' + id);

	cardOrderBtn.addEventListener('click', function () {
		const orderIndex = order.findIndex(arr => arr.id === id);
		if (orderIndex === -1) {
			order.push({ id, title, price, img });
			makeOrder(
				id,
				imgPath,
				title,
				formatedPrice,
				cardAddBtn,
				cardOrderBtn,
				span
			);
		} else {
			orderContainer.classList.toggle('order-window_active');
			overlay.classList.toggle('dark-overlay_active');
		}
	});
	cardAddBtn.addEventListener('click', function () {
		const orderIndex = order.findIndex(arr => arr.id === id);
		if (orderIndex === -1) {
			order.push({ id, title, price, img });
			addToCart(
				id,
				imgPath,
				title,
				formatedPrice,
				cardAddBtn,
				cardOrderBtn,
				span
			);
		} else {
			deleteOrderItem(id, cardAddBtn, cardOrderBtn, span);
		}
	});
});
innerBtn.addEventListener('click', () => {
	orderContainer.classList.toggle('order-window_active');
	overlay.classList.toggle('dark-overlay_active');
});
cart.addEventListener('click', () => {
	innerCart.classList.toggle('inner-cart_active');
});
document.addEventListener('mousedown', event => {
	const headerContainer = document.querySelector('.header');
	const withinCartBoundaries = event.composedPath().includes(innerCart);
	const withinHeaderBoundaries = event.composedPath().includes(headerContainer);

	const withinFormBoundaries = event.composedPath().includes(orderContainer);
	if (
		!withinCartBoundaries &&
		!withinHeaderBoundaries &&
		innerCart.classList.contains('inner-cart_active')
	) {
		innerCart.classList.remove('inner-cart_active');
	}
	if (
		!withinFormBoundaries &&
		orderContainer.classList.contains('order-window_active')
	) {
		orderContainer.classList.remove('order-window_active');
		overlay.classList.toggle('dark-overlay_active');
	}
});
orderForm.addEventListener('submit', event => {
	const notification = document.querySelector('.submit-notification');
	event.preventDefault();
	const timerId = setInterval(() => {
		notification.classList.toggle('submit-notification_active');
		if (!notification.classList.contains('submit-notification_active')) {
			orderContainer.classList.toggle('order-window_active');
			overlay.classList.toggle('dark-overlay_active');
			deleteAllOrder();
			clearInterval(timerId);
		}
	}, 3000);
	notification.classList.toggle('submit-notification_active');
});
