async function getProducts() {
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const res = await data.json();
        window.localStorage.setItem("products", JSON.stringify(res));
        return res;

    } catch (error) {
        console.log(error);
    }
}


function printProducts(db) {
    const productsHTML = document.querySelector(".products")


    let html = "";

    for (const product of db.products) {
        const buttonAdd = product.quantity
            ? `<i class='bx bx-plus'   id='${product.id}' ></i>
            <span class="product_info--stock">stock: ${product.quantity}</span>`
            : "<span class='product__soldout'>sold out</span>";
        html += `
        <div class="product shirt">
            <div class="product__img">
                <img src="${product.image}" alt="imagen"/>
            </div>

            <div class="product_info">
                
                <h3>S/${product.price} <p> ${buttonAdd}</p></h3>
                <p class="showModalProduct"  id='${product.id}' >${product.name} </p>
               
            </div>  
        </div>
                  `;

    }

    productsHTML.innerHTML = html;

}


function handleShowCart() {
    const iconCarHTML = document.querySelector(".bx-shopping-bag")
    const carHTML = document.querySelector(".contentCart")
    const bxHTML = document.querySelector(".bx-x")



    iconCarHTML.addEventListener("click", function () {
        carHTML.classList.toggle("contentCart_show")


    });

    bxHTML.addEventListener("click", function () {
        carHTML.classList.toggle("contentCart_show")


    });
}

function darkTheme() {
    const iconMonHTML = document.querySelector(".bx-moon")
    const bodyHTML = document.querySelector("body")


    iconMonHTML.addEventListener("click", function () {
        bodyHTML.classList.toggle("dark-theme");
        iconMonHTML.classList.toggle("bx-sun");

    });
}


function headerScrool() {
    const t = document.querySelector("#headerPrincipal")


    window.addEventListener("scroll", function () {
        window.scrollY > 100 ?
            t.classList.add("header_show") :
            t.classList.remove("header_show")

    })
}

function headerScroole() {
    const iconMonHTML = document.querySelector(".bxs-dashboard")
    const bodyHTML = document.querySelector(".navbar_menu")


    iconMonHTML.addEventListener("click", function () {
        bodyHTML.classList.toggle("navbar_menu-show");

    });
}


function modalProduct(db) {

    const productsHTML = document.querySelector(".products");
    const bodyHTML = document.querySelector(".modalProduct");
    let html = "";

    productsHTML.addEventListener('click', function (e) {
        if (e.target.classList.contains("showModalProduct")) {
            bodyHTML.classList.add("modalProduct__show");
            const id = Number(e.target.id);
            const productFind = db.products.find(
                (product) => product.id === id);

        
                html += `
                <div class="contentProduct">
                <i class="bx bxs-x-circle closeModal"></i>
                <div class="contentProduct__img">
                    <img src="${productFind.image}" alt="">
                </div>
                <h3 class="contentProduct__name">${productFind.name} - <span>${productFind.category}</span></h3>
                <p class="contentProduct__p">${productFind.description}</p>

                <div class="contentProduct__info">
                    <h3>$${productFind.price}</h3>

                    <p>stock:${productFind.quantity}</p>
                </div>
            </div>
            `
        }
        
        bodyHTML.innerHTML = html
        console.log(bodyHTML)
         const iconMonHTML = document.querySelector(".bxs-x-circle")
        iconMonHTML.addEventListener("click", function () {
            bodyHTML.classList.remove("modalProduct__show");
            location.reload();
    
    })

    
    });


}








function addtoCartFromProducts(db) {

    const productsHTML = document.querySelector(".products");
    productsHTML.addEventListener('click', function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id

            );

            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert('No tenemos mas STOCK')
                db.cart[productFind.id].amount++;
            }
            else {
                db.cart[productFind.id] = { ...productFind, amount: 1 };
            }

            window.localStorage.setItem("cart", JSON.stringify(db.cart));



            printProductsInCart(db)
            printTotal(db);
            handlePrintAmountProducts(db)
        }
    });

}


function printProductsInCart(db) {
    const cartProducts = document.querySelector(".contentCart__products");
    let html = "";

    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];
        let totalProducts = 0;
        totalProducts += price * amount;

        html += `
            <div class="product__card" >
                <div  class="product__card--img">
                  <img src="${image}" alt="imagen" />
                </div>
            <div class="product__card--body ">
                <h4>${name}</h4>
                <p>Stock: ${quantity} | <span>S/${price}</span></p>
                <p>subtotal: S/${totalProducts}</p>

                   <div class="product__card--action" id='${id}'>
                    <i class='bx bx-minus'></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash'></i>
                     </div>
                 </div>
            </div >
                `;
    }
    cartProducts.innerHTML = html;
}



function handleProductsInCart(db) {
    const cartProducts = document.querySelector(".contentCart__products")
    cartProducts.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id);

            const productFind = db.products.find(
                (product) => product.id === id

            );
            if (productFind.quantity === db.cart[productFind.id].amount)
                return alert('No tenemos mas STOCK')
            db.cart[id].amount++;

        }
        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1) {
                const response = confirm(
                    "Estas seguro de que quieres eliminar este producto?"
                );
                if (!response) return;
                delete db.cart[id]
            } else {
                db.cart[id].amount--;
            }



        }
        if (e.target.classList.contains("bx-trash")) {
            const id = Number(e.target.parentElement.id);
            const response = confirm(
                "Estas seguro de que quieres eliminar este producto?"
            );
            if (!response) return;
            delete db.cart[id]


        }
        window.localStorage.setItem("cart", JSON.stringify(db.cart))
        printProductsInCart(db)
        printTotal(db);
        handlePrintAmountProducts(db)
    });

}


function printTotal(db) {
    const infoTotal = document.querySelector(".numberItems");
    const infoAmount = document.querySelector(".totalPrice");

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;

        infoAmount.textContent = amountProducts + " units"
        infoTotal.textContent = "S/" + totalProducts + ".00"
    }

}


function handleTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function () {
        if (!Object.values(db.cart).length)
            return alert("No hay productos en el carrito!!!");
        const response = confirm("Seguro que quieres comprar?");
        if (!response) return;

        const currentProduct = [];
        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProduct.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            } else {
                currentProduct.push(product);
            }
        }

        db.products = currentProduct;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db)

    });
}


function handlePrintAmountProducts(db) {
    const amountProducts = document.querySelector(".totalAmountProducts");

    let amount = 0

    for (const product in db.cart) {
        amount += db.cart[product].amount;
    }

    amountProducts.textContent = amount;
}


async function main() {

    const db = {
        products:
            JSON.parse(window.localStorage.getItem("products")) ||
            (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    };


    printProducts(db);
    handleShowCart();
    darkTheme()
    headerScrool()
    headerScroole()
    modalProduct(db)
    addtoCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db)

}






main()
