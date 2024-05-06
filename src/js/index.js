fetch('./json/items.json')
  .then(response => response.json())
  .then(data => {
    // Your code for populating the shop with data
    //shop pagina insert
const shop = document.getElementById("items");
const wishlistButtons = document.getElementsByClassName("wishlist");

//shop pagina insert
for (let i = 0; i < 3; i++) {
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
    const productNameParagraph = document.createElement('p');
    productNameParagraph.id = 'shop_product_name';
    let shopItemSection = document.createElement('section');
    shopItemSection.classList.add('shop_item');
    // image insert
    productImage.classList.add('detailPage');
    productImage.id = `${data[i].id}`
    productImage.src = `${data[i].img}`;
    productPage.appendChild(productImage);
    productPage.setAttribute('href', './product.html');
    figureElement.appendChild(productPage);
    // price insert
    priceBeforeSpan.textContent = `€${data[i].priceBefore}`;
    currentPriceSpan.textContent = `€${data[i].price}`;    
    priceParagraph.appendChild(priceBeforeSpan);
    priceParagraph.appendChild(currentPriceSpan);
    priceParagraph.appendChild(wishlistButtonInsert);
    priceParagraph.appendChild(addToCartButton);
    //wishlist
    wishlistButtonInsert.appendChild(wishlistIcon);
    //addtocart
    addToCartButton.appendChild(addToCartIcon);
    //product name
    productNameParagraph.textContent = `${data[i].name}`;
    // alles naar shop_item class inserten
    shopItemSection.appendChild(figureElement);
    shopItemSection.appendChild(priceParagraph);
    shopItemSection.appendChild(productNameParagraph);
    // insert naar shop
    shop.appendChild(shopItemSection);

    //session storage
    shop.appendChild(shopItemSection);
        productImage.addEventListener("click", (e) => {
            console.log(e.target.id);
            sessionStorage.setItem("id", e.target.id);
            console.log(sessionStorage.getItem("id"));
        })
}

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

////

////
  })
  .catch(error => console.error('Error fetching items:', error));

  
//img alt vragen of moet?

