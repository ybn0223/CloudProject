//php increaseQuantity function
function increaseQuantity(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Send update to the server
        fetch('./php/increaseQuantity.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Quantity increased');
            } else {
                console.error('Error increasing quantity:', data.error);
            }
        })
        .catch(error => {
            console.error('Error increasing quantity:', error);
        });
    }
}

function decreaseQuantity(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Send update to the server
            fetch('./php/decreaseQuantity.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Quantity decreased');
                } else {
                    console.error('Error decreasing quantity:', data.error);
                }
            })
            .catch(error => {
                console.error('Error decreasing quantity:', error);
            });
        } else {
            // Remove item if quantity is exactly 1
            removeFromCart(productId);
        }
    }
}



//php removeFromCart function
function removeFromCart(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Send delete request to the server
        fetch('./php/removeFromCart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Product removed from shopping cart');
            } else {
                console.error('Error removing product from shopping cart:', data.error);
            }
        })
        .catch(error => {
            console.error('Error removing product from shopping cart:', error);
        });
    }
}




fetch('./json/items.json')
  .then(response => response.json())
  .then(data => {//shop pagina insert
    const shop = document.getElementById("shop");
    const wishlistButtons = document.getElementsByClassName("wishlist");
    const cartClose = document.getElementById('cart_close_icon');
    //shop pagina insert
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
        // image insert
        productPage.classList.add('detailPage');
        productImage.id = `${product.id}`;
        productImage.src = `${product.img}`;
        productPage.appendChild(productImage);
        productPage.setAttribute('href', './product.html');
        figureElement.appendChild(productPage);
        // price insert
        if (product.priceBefore != ""){
            priceBeforeSpan.textContent = `€${product.priceBefore}`
        }
        currentPriceSpan.textContent = `€${product.price}`;    
        priceParagraph.appendChild(priceBeforeSpan);
        priceParagraph.appendChild(currentPriceSpan);
        priceParagraph.appendChild(wishlistButtonInsert);
        priceParagraph.appendChild(addToCartButton);
        //wishlist
        wishlistButtonInsert.appendChild(wishlistIcon);
        //addtocart
        addToCartButton.appendChild(addToCartIcon);
        //product name
        productNameParagraph.textContent = `${product.name}`;
        // alles naar shop_item class inserten
        shopItemSection.appendChild(figureElement);
        shopItemSection.appendChild(priceParagraph);
        shopItemSection.appendChild(productNameParagraph);
        // insert naar shop
        
        function addToCart(product) {
            // Update the cart items in sessionStorage
            const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const newItem = {
                    id: product.id,
                    img: product.img,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                };
                cartItems.push(newItem);
            }
        
        
        
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        
            // Send product data to the server
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
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Product added to shopping cart');
                } else {
                    console.error('Error adding product to shopping cart:', data.error);
                }
            })
            .catch(error => {
                console.error('Error adding product to shopping cart:', error);
            });
        }        
        //delete item php

        function removeFromCart(productId) {
            // Get the cart items from sessionStorage
            let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
            
            // Find the index of the item to be removed
            const itemIndex = cartItems.findIndex(item => item.id === productId);
            
            if (itemIndex > -1) {
                // Remove the item from the cart
                cartItems.splice(itemIndex, 1);
                
                // Update sessionStorage
                sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        
                // Optionally, send product data to the server to update the cart in the database
                fetch('./php/removeFromCart.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: productId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Product removed from shopping cart');
                    } else {
                        console.error('Error removing product from shopping cart:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error removing product from shopping cart:', error);
                });
            }
        }        

        //session storage
        shop.appendChild(shopItemSection);
        //item detail id
        productImage.addEventListener("click", (e) => {
            sessionStorage.setItem("id", e.target.id);
        })
        function showCart(){
            if(document.getElementById("cart").style.display !== "block"){
                document.getElementById("cart").style.display = "block";
                const shop = document.getElementById('shop');
                shop.style.gridColumn = "span 1";
                shop.style.marginRight = "0rem";
                shop.style.padding = '1rem';
            }
        }
                addToCartButton.addEventListener("click", function(e){
                showCart();
                let cartIndex = e.target.id;
               //php script function
               addToCart({
                id: product.id,
                img: product.img,
                name: product.name,
                price: product.price
            });
                //cart item list
                
                cartIndex = e.target.id;
    
                let existingCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
                let itemExists = false;
            
                for (let i = 0; i < existingCartItems.length; i++) {
                    if (existingCartItems[i].id === cartIndex) {
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
                }
            
                sessionStorage.setItem('cartItems', JSON.stringify(existingCartItems));
                function displayCartItems() {
                    const cartContent = document.getElementById('cart_content');
                    cartContent.innerHTML = ''; // Clear cart
                    let existingCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
                
                    for (let i = 0; i < existingCartItems.length; i++) {
                        
                        //create elements
                        const cartContent = document.getElementById('cart_content')
                        const cartItem = document.createElement('section');
                        cartItem.classList.add('cart_item');
                        //image
                        const cartImg = document.createElement('img');
                        const cartFig = document.createElement('figure');
                        cartFig.id = 'cart_image';
                        //cart text
                        const cartTextSpan = document.createElement('span');
                        const cartItemName = document.createElement('p');
                        const cartItemQuantity = document.createElement('p');
                        const cartItemPrice = document.createElement('p');
                        cartTextSpan.id = 'cart_text';
                        cartItemName.id = 'cart_product_name';
                        cartItemQuantity.id = 'quantity';
                        cartItemPrice.id = 'price_cart';
                        //cart buttons
                        const cartButtons = document.createElement('section');
                        const minusButton = document.createElement('button');
                        const plusButton = document.createElement('button');
                        const trashButton = document.createElement('button');
                        const minusIcon = document.createElement('i');
                        const plusIcon = document.createElement('i');
                        const trashIcon = document.createElement('i');
                        minusIcon.classList.add('fa', 'fa-minus-square');
                        minusButton.appendChild(minusIcon);
                        minusButton.id = `minus ${existingCartItems[i].id}`;
                        plusIcon.classList.add('fa', 'fa-plus-square');
                        plusButton.appendChild(plusIcon);
                        plusButton.id = `plus ${existingCartItems[i].id}`;
                        trashIcon.classList.add('fa', 'fa-trash');
                        trashButton.id = `trash ${existingCartItems[i].id}`;
                        trashButton.appendChild(trashIcon);
                        cartButtons.appendChild(plusButton);
                        cartButtons.appendChild(minusButton);
                        cartButtons.appendChild(trashButton);
                        cartButtons.id = 'cart_buttons';
                        
                        //set values values
                        cartImg.src = existingCartItems[i].img; // Set image source
                        cartImg.alt = existingCartItems[i].name; // Set image alt text
                        cartFig.appendChild(cartImg);
                        cartItemName.textContent = existingCartItems[i].name; // Set product name
                        cartItemQuantity.textContent = `hoeveelheid: ${existingCartItems[i].quantity}`; // Set quantity
                        cartItemPrice.textContent = `prijs: ${existingCartItems[i].price}`; // Set price
                        
                        // element insert
                        cartTextSpan.appendChild(cartItemName);
                        cartTextSpan.appendChild(cartItemQuantity);
                        cartTextSpan.appendChild(cartItemPrice);
                        cartItem.appendChild(cartFig);
                        cartItem.appendChild(cartTextSpan);
                        cartItem.appendChild(cartButtons);
                        cartContent.appendChild(cartItem);
                        
                        document.getElementById(`plus ${existingCartItems[i].id}`).addEventListener("click", function(e){
                            increaseQuantity(existingCartItems[i].id)
                            existingCartItems[i].quantity++;
                            cartItemQuantity.textContent = `hoeveelheid: ${existingCartItems[i].quantity}`; // Set quantity
                            document.getElementById('checkout_text').textContent = `te betalen: €` + `${totalPriceCalc()}`;
                        })
                        document.getElementById(`minus ${existingCartItems[i].id}`).addEventListener("click", function(e){
                            decreaseQuantity(existingCartItems[i].id)
                            let currentItemIdDel = existingCartItems[i].id;
                            existingCartItems[i].quantity--;
                            cartItemQuantity.textContent = `hoeveelheid: ${existingCartItems[i].quantity}`; // Set quantity
                            document.getElementById('checkout_text').textContent = `te betalen: €${totalPriceCalc()}`;
                            if(existingCartItems[i].quantity < 1){
                                trash();
                                removeFromCart(currentItemIdDel);
                            }
                            if(existingCartItems.length == 0){
                                closeCart();
                            }
                        })
                        function trash(){
                            let currentItemId = existingCartItems[i].id;
                            cartItem.style.borderBottom = 'none';
                            cartItem.innerHTML = ''; // Clear cart
                            existingCartItems.splice(i, 1);
                            document.getElementById('checkout_text').textContent = `te betalen: €${totalPriceCalc()}`;
                            sessionStorage.setItem('cartItems', JSON.stringify(existingCartItems));
                            removeFromCart(currentItemId);
                        }
                        document.getElementById(`trash ${existingCartItems[i].id}`).addEventListener("click", function(e){
                            trash();
                            if(existingCartItems.length == 0){
                                closeCart();
                            }
                        })
                        //cart plus button functional
                        
                    }
                    //total price
                        function totalPriceCalc() {
                            let totalPriceSum = 0;
                            for (let i = 0; i < existingCartItems.length; i++) {
                                totalPriceSum += existingCartItems[i].quantity * existingCartItems[i].price;
                            }
                            return totalPriceSum.toFixed(2);
                        }
                    const checkout = document.createElement('section');
                    checkout.classList.add('checkout');
                    const checkoutText = document.createElement('p');
                    const TotalPrice = document.createElement('span');
                    checkoutText.id = 'checkout_text';
                    TotalPrice.id = 'total_price';
                    checkoutText.textContent = 'te betalen: €' + `${totalPriceCalc()}`;
                    
                    checkout.appendChild(checkoutText);
                    cartContent.appendChild(checkout);
                        sessionStorage.setItem('cartItems', JSON.stringify(existingCartItems));
                    }
                displayCartItems();
                //show cart
                const navShoppingCart = document.getElementById('nav_shopping_cart');
                navShoppingCart.addEventListener("click", function(e){
                    showCart();
                });
                
            });
           
    }
    //wishlist buttons
    for (let i = 0; i < wishlistButtons.length; i++) {
        wishlistButtons[i].addEventListener("click", function(e){
            if(wishlistButtons[i].style.color == "red"){
                wishlistButtons[i].style.color = "grey"
            }
            else{
                wishlistButtons[i].style.color = "red"
            }
        })    
    }
    function closeCart(){
        document.getElementById("cart").style.display = "none";
        document.getElementById("shop").style.gridColumn = "span 2";
        document.getElementById("shop").style.paddingRight = "3rem";
    }
    //close cart
    cartClose.addEventListener("click", function(e){
        closeCart();
    })

  })
  .catch(error => console.error('Error fetching items:', error));
    