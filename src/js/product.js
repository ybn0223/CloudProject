fetch('./json/items.json')
.then(response => response.json())
.then(item => {
    //product title
    let id = sessionStorage.getItem("id")-1;
    document.getElementById('product_title').textContent = item[id].name;
    //image
    const productImg = document.createElement('img');
    productImg.setAttribute('src', item[id].img);
    const productImgTemplate = document.getElementById('product_img');
    productImgTemplate.appendChild(productImg);
    //features
    const featuresList = document.getElementById('features_list');
    for (let i = 0; i < item[id].features.length; i++) {
        const feature = document.createElement('li');
        feature.appendChild(document.createTextNode(item[id].features[i]));
        featuresList.appendChild(feature);
    }
    //price
    if(item[id].priceBefore !== ""){
        document.getElementById('price').textContent = `€${item[id].priceBefore}` ;
    }
    document.getElementById('promo-price').textContent = `€${item[id].price}`;
    //sizes
    //if voor items zonder maat
    if(item[id].sizes.length > 0){
        const productSize = document.getElementById('product_size');
    for (let i = 0; i < item[id].sizes.length; i++) {
    const sizesOption = document.createElement('option');
    sizesOption.appendChild(document.createTextNode(item[id].sizes[i]));
    productSize.appendChild(sizesOption);
    }}
    //maat option weghalen
    else{
        document.getElementById('product_size').style.display = 'none';
        document.getElementById('to_shopping_cart').style.marginLeft = 0;
    }
    //size guide
    document.getElementById('description').textContent = item[id].description;
    if(item[id].type !== "lock"){
        if(item[id].type == "helmet"){
            document.getElementById('size_guide_img').setAttribute('src', './assets/images/helmet_size_guide.jpg');
            document.getElementById('size_guide_img').setAttribute('alt', 'helmet size guide');
        }
        else if(item[id].type == "pants"){
            document.getElementById('size_guide_img').setAttribute('src', './assets/images/pants_size_guide.jpg');
            document.getElementById('size_guide_img').setAttribute('alt', 'pants size guide');
        }
        else if(item[id].type == "jacket"){
            document.getElementById('size_guide_img').setAttribute('src', './assets/images/jacket_size_guide.jpg');
            document.getElementById('size_guide_img').setAttribute('alt', 'jacket size guide');
        }
        else if(item[id].type == "shoes"){
            document.getElementById('size_guide_img').setAttribute('src', './assets/images/shoes_size_guide.jpg');
            document.getElementById('size_guide_img').setAttribute('alt', 'shoes size guide');
        }
    }
    
    //url leesbaar maken met product naam voor detail pagina
})