const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartCounter = document.getElementById("cart-count")
const cartItems = document.getElementById("cart-items")
const totalValue = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const address = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const menu = document.getElementById("menu")

let cart = [];

// atualizar o carrinho quando abrir a janela  //  cart update when show cart window
cartBtn.addEventListener("click", function(){
    updateCart();
    cartModal.style.display = "flex"
})

// fechar a janela do carrinho quando clicar fora da janela  //  close cart window when click outside cart window
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// botão de fechar a janela do carrinho  // button to close cart window
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// botão de adicionar itens ao carrinho  //  add to cart button
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToCart(name, price)
    }

})

// função para o botão de adicionar itens ao carrinho  // function to add items to cart button
function addToCart(name, price){
    const exist = cart.find(item => item.name === name)

    if(exist){
        exist.quantity += 1;
    } else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCart()
}

// função para gerenciar o carrinho conforme adiciona itens // function to manage the cart, when add items
function updateCart(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div class="justify-end">
                <button class="add-cart-btn px-2 py-1 gap-2 bg-gray-900 rounded" data-name="${item.name}">
                    <i class="fa fa-plus text-white"></i>
                </button>

                <button class="sub-cart-btn px-2 py-1 gap-2 ml-2 bg-gray-900 rounded" data-name="${item.name}">
                    <i class="fa fa-minus text-white"></i>
                </button>

                <button class="remove-from-cart-btn px-2 py-1 gap-2 ml-6 bg-gray-900 rounded" data-name="${item.name}">
                    <i class="fa fa-trash-can text-red-500"></i>
                </button>
            </div>
        </div>
        `

        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement)
    })

    totalValue.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// botão de remover item do carrinho // remove cart item button
cartItems.addEventListener("click", function(event){
    let parentButton = event.target.closest(".remove-from-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        removeItemCart(name);
    }
})

// botão de subtrair quantidade do produto no carrinho // button to subtract quantity of the cart items
cartItems.addEventListener("click", function(event){
    let parentButton = event.target.closest(".sub-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        subtractItemCart(name);
    }
})

// botão de adicionar quantidade do produto no carrinho // button to add quantity of the cart items
cartItems.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        addItemCart(name);
    }
})

// função para o botão de remover // function for remove button
function removeItemCart(name){
    const index = cart.findIndex(item=> item.name === name);

    if(index !== -1){
        const item = cart[index];
        cart.splice(index, 1);
        updateCart();
    }
}

// função para o botão de subtrair // function for subtract button
function subtractItemCart(name){
    const index = cart.findIndex(item=> item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity >1){
            item.quantity -=1;
        }
        updateCart();
    }
}

// função para o botão de adicionar // function for add button
function addItemCart(name){
    const index = cart.findIndex(item=> item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity >0){
            item.quantity +=1;
        }
        updateCart();
    }
}

// verificar se o campo de endereço está vazio  //  check if address input is blank
address.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !==""){
        address.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// lógica para finalizar a compra  //  logic to checkout the purchase
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkOpen();
    if(!isOpen){
        Toastify({
            text: "Desculpe, o restaurante está fechado. Tente novamente mais tarde!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(address.value === ""){
        addressWarn.classList.remove("hidden")
        address.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "16992454184"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${address.value}`)

    address.value = "";
    cart.length = 0;
    updateCart();
})

// função para verificar se o restaurante está aberto baseado no horário  //  function to check if the restaurant is open based in time
function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-500");
}else{
    spanItem.classList.add("bg-red-600");
    spanItem.classList.remove("bg-green-500");
}