let defaultItems = `[{"name":"Sample Watch", "price":"199", "description":"blabla", "image":"https://sc02.alicdn.com/kf/HTB1gHRfg6uhSKJjSspmq6AQDpXaI/Accept-Sample-Design-Your-Own-Blank-Wrist.jpg_350x350.jpg"}, {"name":"PRODUCT #2", "price":"230", "description":"some watch", "image":"https://pl.shadestation.com/media/thumbs/350x350/media/product_images/Fossil-Watches-FS5439fw350fh350.jpg"}]`;
defaultItems = JSON.parse(defaultItems);
let items=[];let totalPrice=0;
let cart = [];

document.getElementById("add").addEventListener("click", add);
document.getElementsByClassName("list-products")[0].addEventListener("click", addToCart);
document.getElementsByClassName("shopping-cart-products")[0].addEventListener("click", addMore);

document.getElementById("purchase").addEventListener("click", function(){ if(totalPrice>0){alert("Purchased successfully");}else{alert("Your cart is empty");} });

function firstLoad(){

    if(localStorage.getItem("items")!==null){
       /*  console.log(localStorage.getItem("items")); */
       try{
        loadItems();
       }catch{
           localStorage.clear();
           location.reload();
       }
    }else{
        fetchItems();
    }

}


function fetchItems(){
    fetch("https://jsonblob.com/api/jsonBlob/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'redirect': 'follow'
        },
        body: JSON.stringify(defaultItems)
      }).then(function(res){ return res.headers.get('Location'); })
      .then(function(data){ localStorage.setItem("items", data); loadItems();});
}

function loadItems(){
    fetch(localStorage.getItem("items")) 
    .then(response=>{
   return response.json();
    })
.then(response=>{
items=JSON.stringify(response);
items=JSON.parse(items);
loadItems2();
})
    .catch(function(error){
        console.log(error);
    });
}

function loadItems2(){
    
        for(let i=0; i<items.length; i++){
            document.getElementsByClassName("list-products")[0].innerHTML+=`
        <div class="product">
                    <img src="${items[i].image}">
                    <p>${items[i].name}</p>
                    <p>$${items[i].price}</p>
                    <input type="hidden" value="${items[i].description}" class="productDescription"/>
                    <button class="details-button" data-id="${i}">Details</button>
                    <button class="buy-button" data-id="${i}">Buy</button>
                  </div>
                  `;
            }

}

function add(){
    event.preventDefault();
    let addItems = items;
    let name=document.getElementById("name").value;
    let price=document.getElementById("price").value;
    let description=document.getElementById("description").value;
    let image=document.getElementById("image").value;
    addItems.push(JSON.parse(`{"name":"${name}", "price":"${price}", "description":"${description}", "image":"${image}"}`));
    let url = localStorage.getItem("items");
    fetch(url,{
  
          method: 'PUT',
  
          headers: {
  
              'Content-Type': 'application/json'
  
          },
  
          body: JSON.stringify(addItems)
  
      })
      .then((response) => response.json())
      .then(function(data) { document.getElementsByClassName("list-products")[0].innerHTML=""; loadItems();})
      .catch((error) => console.log(error))
}

function addToCart(){
    let doesExist=true;
    let update = false;
    if(event.target.classList.contains("buy-button")){
        for(let i=0; i<cart.length; i++){
            if(cart[i].id === event.target.dataset.id){
            doesExist=false;
            if(Number(cart[i].count)<=0){
            cart[i].count = "1";
            update=true;    
            }
            }
        }
        if(doesExist){
     cart.push(JSON.parse(`{"name":"${event.target.parentNode.getElementsByTagName("p")[0].innerHTML}", "price":"${event.target.parentNode.getElementsByTagName("p")[1].innerHTML}", "image":"${event.target.parentNode.getElementsByTagName("img")[0].src}", "count":"1", "id":"${event.target.dataset.id}"}`));
    addToCart2(JSON.parse(`{"name":"${event.target.parentNode.getElementsByTagName("p")[0].innerHTML}", "price":"${event.target.parentNode.getElementsByTagName("p")[1].innerHTML}", "image":"${event.target.parentNode.getElementsByTagName("img")[0].src}", "count":"1", "id":"${event.target.dataset.id}"}`));
    updatecart();
        }else{
            if(update===true){
            updatecart();
            }else{
            alert("Product already in cart");
            }
        }
        
    }else if(event.target.classList.contains("details-button")){
    modalWindow(event.target.dataset.id);
    }
}


function addToCart2(x){
    document.getElementsByClassName("shopping-cart-products")[0].innerHTML+=`
    <div class="shopping-cart-product" data-id="${x.id}">
              <div class="product-info">
                <div>
                  <h3>${x.name}</h3>
                  <p>${x.price} × ${x.count}</p>
                </div>
                <img src="${x.image}">
              </div>
              <div class="product-count">
                <button class="minus">-</button>
                <span>1</span>
                <button class="plus">+</button>
              </div>
            </div>`;
}

function addMore(){

/* if(event.target.classList.contains("plus")){
   cart = cart.filter(item => Number(item.id) !== Number(event.target.parentNode.parentNode.dataset.id || Number(item.count)<=0));
   console.log(cart);
} */

if(event.target.classList.contains("plus")){
    for(let i=0;i<cart.length;i++){
        if( Number(cart[i].id) === Number(event.target.parentNode.parentNode.dataset.id )){
         if(Number(cart[i].count)<10){
             cart[i].count = (Number(cart[i].count) + 1).toString();
             updatecart(cart[i]);
         }
         break;
        }
    }
}

if(event.target.classList.contains("minus")){
    for(let i=0;i<cart.length;i++){
        if( Number(cart[i].id) === Number(event.target.parentNode.parentNode.dataset.id )){
         if(Number(cart[i].count)>0){
             cart[i].count = (Number(cart[i].count) - 1).toString();
             updatecart(cart[i]);
         }
         break;
        }
    }
}

}

function updatecart(){
    let total=0;
    document.getElementsByClassName("shopping-cart-products")[0].innerHTML="";

    for(let i = 0; i<cart.length; i++){
    if(cart[i].count>0){
        total += Number(cart[i].count)*Number(cart[i].price.substring(1));
        addToCart2(cart[i]);
    }
    }

document.getElementById("total").innerHTML = "Total: $" + total;
totalPrice=total;

}

function modalWindow(x){
document.getElementById("modalWindow").innerHTML = `<button id="closeModalWindow">close</button>
<h3>${items[x].name}</h3><img src="${items[x].image}"><p>${items[x].description}</p>
`;
document.getElementById("modalWindowContainer").classList.add("showModalWindow");
document.getElementById("closeModalWindow").addEventListener("click", function(){ document.getElementById("modalWindowContainer").classList.remove("showModalWindow"); });
}

firstLoad();