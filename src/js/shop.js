fetch('./json/items.json')
  .then(response => response.json())
  .then(data => {
    const shop = document.getElementById("shop");
    const wishlistButtons = document.getElementsByClassName("wishlist");
    const cartClose = document.getElementById('cart_close_icon');

    for (const product of data) {
        const figureElement = document.createElement('figure');
        const productPage = document.createElement('a');
        const productImage = document.createElement('img');
        const priceParagraph = document.createElement('p');
        priceParagraph.id = 'shop_price';
        const priceBeforeSpan = document.createElement('span');
        priceBeforeSpan.id = 'price_before';
        const currentPriceSpan = document.createElement('span');
        currentPriceSpan.id = 'current_price';
        const wishlistButtonInsert = document.createElement('button');
        wishlistButtonInsert.classList.add('wishlist');
        const wishlistIcon = document.createElement('i');
        wishlistIcon.classList.add('fa');
        wishlistIcon.classList.add('fa-heart');
        wishlistIcon.setAttribute('aria-hidden', 'true');
        const addToCartButton = document.createElement('button');
        addToCartButton.id = 'addto_cart';
        const addToCartIcon = document.createElement('i');
        addToCartIcon.classList.add('fa');
        addToCartIcon.classList.add('fa-shopping-basket');
        addToCartIcon.setAttribute('aria-hidden', 'true');
        addToCartIcon.id = `${product.id}`;
        const productNameParagraph = document.createElement('p');
        productNameParagraph.id = 'shop_product_name';
        let shopItemSection = document.createElement('section');
        shopItemSection.classList.add('shop_item');

        // Insert image
        productPage.classList.add('detailPage');
        productImage.id = `${product.id}`;
        productImage.src = `${product.img}`;
        productPage.appendChild(productImage);
        productPage.setAttribute('href', './product.html');
        figureElement.appendChild(productPage);

        // Insert price
        if (product.priceBefore != "") {
            priceBeforeSpan.textContent = `€${product.priceBefore}`;
        }
        currentPriceSpan.textContent = `€${product.price}`;    
        priceParagraph.appendChild(priceBeforeSpan);
        priceParagraph.appendChild(currentPriceSpan);
        priceParagraph.appendChild(wishlistButtonInsert);
        priceParagraph.appendChild(addToCartButton);

        // Wishlist
        wishlistButtonInsert.appendChild(wishlistIcon);

        // Add to cart
        addToCartButton.appendChild(addToCartIcon);

        // Product name
        productNameParagraph.textContent = `${product.name}`;

        // Insert into shop_item class
        shopItemSection.appendChild(figureElement);
        shopItemSection.appendChild(priceParagraph);
        shopItemSection.appendChild(productNameParagraph);

        // Insert into shop
        shop.appendChild(shopItemSection);

        // Item detail id
        productImage.addEventListener("click", (e) => {
            sessionStorage.setItem("id", e.target.id);
        });

        function showCart() {
            if (document.getElementById("cart").style.display !== "block") {
                document.getElementById("cart").style.display = "block";
                const shop = document.getElementById('shop');
                shop.style.gridColumn = "span 1";
                shop.style.marginRight = "0rem";
                shop.style.padding = '1rem';
            }
        }

        addToCartButton.addEventListener("click", function(e) {
            console.log('Add to Cart button clicked'); // Log to verify event listener
            showCart();
            let cartIndex = e.target.id;
            let existingCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
            let itemExists = false;

            for (let i = 0; i < existingCartItems.length; i++) {
                if (existingCartItems[i].id === cartIndex) {
                    existingCartItems[i].quantity++;
                    itemExists = true;
                    break;
                }
            }

            if (!itemExists) {
                let cartItemsList = {
                    id: cartIndex,
                    img: `${product.img}`,
                    name: `${product.name}`,
                    price: product.price,
                    quantity: 1
                };
                existingCartItems.push(cartItemsList);
            }

            sessionStorage.setItem('cartItems', JSON.stringify(existingCartItems));
            displayCartItems();

            console.log('Sending fetch request to addToCart.php'); // Log before fetch
            // Send product data to server
            fetch('./php/addToCart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: product.id,
                    name: product.name,
                    price: product.price
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Product added to shopping cart');
                } else {
                    console.error('Error adding product to shopping cart:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error adding product to shopping cart:', error);
            });
            console.log('Fetch request sent'); // Log after fetch
        });
    }

    // Wishlist buttons
    for (let i = 0; i < wishlistButtons.length; i++) {
        wishlistButtons[i].addEventListener("click", function(e) {
            if (wishlistButtons[i].style.color == "red") {
                wishlistButtons[i].style.color = "grey";
            } else {
                wishlistButtons[i].style.color = "red";
            }
        });
    }

    function closeCart() {
        document.getElementById("cart").style.display = "none";
        document.getElementById("shop").style.gridColumn = "span 2";
        document.getElementById("shop").style.paddingRight = "3rem";
    }

    // Close cart
    cartClose.addEventListener("click", function(e) {
        closeCart();
    });

})
.catch(error => console.error('Error fetching items:', error));