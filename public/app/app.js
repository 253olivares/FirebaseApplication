var _db
var bannerAd = true;
var alreadyRunning = false;
var topNav;
var loginStatus = false;
var loggedUser;
var shippingCost = 60.00;
var coupon = false;
var couponCodes = [];
var savings = 0.00;
let options = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}
var coffeeCart = [];

// debug commands that I create for debugging
let debugCommands = () => {

    // press C to clear sessionStorage
    $(document).keydown((e) => {
        if (e.which == 67) {
            sessionStorage.clear();
            localStorage.clear();
            $(".bannerAd").removeClass("test");
            $(".bannerAd").css("display", "flex");
            bannerAd = true;
        }
        console.log(e.which);
    })
}

// function creates an event listener that keeps track of our url address to check for any changes
// The first line creates the listener and the second long runs the route function for the first time to land us on the homepage.
let checkHash = () => {
    alreadyRunning = true;
    $(window).on("hashchange", route);
    route();
};

//  fuction that runs whenever our url is changed. Searching for #/ and filters out any word or string afterwards. This way we can then fish for the correct segment of html code.
let route = () => {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/", "");

    switch (pageID) {
        case "home":
            MODEL.changeContent(pageID, afterRoute);
            break;
        case "cart":
            MODEL.changeContent(pageID, afterRoute);
            break;
        default:
            if (pageID.length == 0) {
                MODEL.changeContent("home", afterRoute);
                console.log("route: First load blank");
            } else {
                MODEL.changeContent("404", afterRoute);
                console.log("route: url us invalid or empty taken back to home");
            }
            break
    }
}

// function to run any script after redirection to a new page
let afterRoute = (page) => {
    switch (page) {
        case "home":
            console.log("afterRoute: You are on the home page!");
            loadMachine();
            break;
        case "cart":
            console.log("afterRoute: you are on the cart page!");
            cartPageappend();
            checkoutListener()
            break;
    }

}

// checks to see if banner is suppose to exist
let checkBanner = () => {
    if (sessionStorage.getItem("banner") == "true") {
        $(".bannerAd").css("display", "none");
        bannerAd = false;
    } else {
        $(".bannerAd__close__button").click(() => {
            $(".bannerAd").addClass("test");
            sessionStorage.setItem("banner", true);
            bannerAd = true;
        })
        console.log("checkBanner function: no local storeage banner!");
    }
}

let checkoutListener = () => {

    const delay = ms => new Promise(res => setTimeout(res, ms));

    $("#checkout,#checkoutPaypal").click(async () => {
        let selected = $(event.target)
        if (loginStatus == false) {
            document.getElementById("signInButton").scrollIntoView();
            selected.parent().find("p").css("opacity", "0");
            await delay(350);
            selected.parent().find("p").css("opacity", "1");
            let slectedColor = selected.css("background-color");
            selected.css("background-color", "#cd2832");
            await delay(500);
            selected.css("background-color", slectedColor);
        } else {
            let orderTotal = $(".cartPage__content__cartinfo__total__container__orderTotal>p>span").text();
            let orderNumSummary = $(".cartPage__content__cartinfo__total__container__subtotal>h1>span>span").text();
            let orderDate = new Date().toLocaleDateString();
            console.log(orderTotal);
            console.log(orderNumSummary);
            console.log(orderDate);
            console.log("User Info: ", loggedUser);
            await _db.collection("ORDERS").add({
                userId: loggedUser.id,
                transactionDate: orderDate,
                numberOfItems: orderNumSummary,
                orderTotalSum: orderTotal
            }).then(async (docRef) => {
                await _db.collection("ORDERS").doc(docRef.id).update({
                    transactionId: docRef.id
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                })
                console.log("Document written with ID: ", docRef.id);
                coffeeCart = [];
                alert("Thanks for placing an order.");
                cartNumer();
                updateUserCart();
                route();
            }).catch((error) => {
                console.error("Error adding document: ", error);
            })
        }
    });

}

// function that sets footer high
let setFooterHeight = () => {
    $(".content-wrap").css("padding-bottom", $(".footer").height())
}

//
let cartNumer = () => {
    console.log("cartNumber:Running");
    try {
        if (coffeeCart.length != 0) {
            let itemNumber = 0;
            console.log("cartnumber functution has run and has found array has more than one");
            $(".keurigHeader__topNav__extraRight__cart__count").css("display", "inline-block");
            for (let i = 0; i < coffeeCart.length; i++) {
                itemNumber += coffeeCart[i].qty;
            }
            $(".keurigHeader__topNav__extraRight__cart__count").text(itemNumber);
            if (itemNumber >= 10) {
                $(".keurigHeader__topNav__extraRight__cart__count").css("font-size", "12.5px")
            } else {
                $(".keurigHeader__topNav__extraRight__cart__count").css("font-size", "15px")
            }
        } else {
            console.log("cartnumber functution has run and has found arrary has none");
            $(".keurigHeader__topNav__extraRight__cart__count").css("display", "none");
        }
    } catch (e) {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
}

//
let searchBarListener = () => {
    try {
        $("#machineSearch").focusin(() => {
            if (bannerAd == true) {
                let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
                $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
                $('html, body').css({
                    overflow: 'hidden'
                });

            } else {
                let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
                $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
                $('html, body').css({
                    overflow: 'hidden'
                });
            }
        }
        )
        $("#machineSearch").focusout(() => {
            $(".grayOverlay").css({ "display": "none" });
            $(".loginContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
        })
    } catch (e) {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
    // $("#machineSearch").on("focus", () => {
    //     console.log("test");
    //     if (bannerAd == true) {
    //         let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
    //         $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
    //         $('html, body').css({
    //             overflow: 'hidden'
    //         });

    //     } else {
    //         let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
    //         $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
    //         $('html, body').css({
    //             overflow: 'hidden'
    //         });
    //     }
    // }, () => {
    // $(".grayOverlay").css({ "display": "none" });
    // $(".loginContainer").css({ "display": "none" });
    // $('html, body').css({
    //     overflow: 'auto'
    // });
    // });
}

// function that loads all machines into our coffee page
let loadMachine = () => {
    machineid = "";
    $("#coffeeDisplay").empty();
    _db
        .collection("COFFEEMAKERS")
        .get()
        .then(
            (x) => {
                console.log("loadMachine function has ran. Database has found and returned: ", x);
                x.forEach((y) => {
                    // Holders

                    // Color Options:
                    //  <button class="listPage__coffeeList__item__colorPicker__Black checkColor selectedColor" color="Black"></button>
                    //  <button class=" listPage__coffeeList__item__colorPicker__Venus checkColor" color="Venus"></button>
                    //  <button class=" listPage__coffeeList__item__colorPicker__Amour checkColor" color="Amour"></button>

                    // Item Discounts:
                    //  <p class="listPage__coffeeList__item__discount__cutPrice"><span>$</span>89.99</p>
                    //  <p class="listPage__coffeeList__item__discount__originalPrice"><span class="oPDS"><span class="oPS">$</span>179.99</span>with Keurig® Starter Kit</p>

                    // Base Price:
                    //  <p><span>$</span>179.99</p>

                    // Rating System:
                    //  <span class="fa fa-star checked"></span>
                    //  <span class="fa fa-star checked"></span>
                    //  <span class="fa fa-star checked"></span>
                    //  <span class="fa fa-star checked"></span>
                    //  <span class="fa fa-star endstar"></span>
                    //  <p>4.5</p>
                    //  <p>|</p>
                    //  <p>(676)</p>

                    $("#coffeeDisplay").append(`
                    <div class="listPage__coffeeList__item hover" listNum="${y.data().id}">
                        <p class="listPage__coffeeList__item__special ${y.data().bannerColor}">${y.data().bannerText}</p>
                        <img class="connection" src="${y.data().coffeeImage}" alt="coffee1">
                        <div class="listPage__coffeeList__item__colorPicker">


                        </div>
                        <h1 class="listPage__coffeeList__item__coffeeName">${y.data().name}</h1>
                        <div class="listPage__coffeeList__item__discount">
                            <p class="listPage__coffeeList__item__discount__cutPrice"><span>$</span>${y.data().discountPrice}</p>
                            <p class="listPage__coffeeList__item__discount__originalPrice"><span class="oPDS"><span class="oPS">$</span>${y.data().originalPrice}</span>with Keurig® Starter Kit</p>
                        </div>
                        <div class="listPage__coffeeList__item__basePrice">
                            <p><span>$</span>${y.data().originalPrice}</p>
                        </div>
                        <div class="listPage__coffeeList__item__coupon">
                            <div class="listPage__coffeeList__item__coupon__icon">
                                <p>Coupon</p>
                            </div>
                            <div class="listPage__coffeeList__item__coupon__detail">
                                <p class="one">25% OFF - HALLOWEEN23</p>
                                <p class="two">Excludes Keurig Starter Kit</p>
                            </div>
                        </div>
                        <div class="listPage__coffeeList__item__ratingSystem">
                            

                        </div>
                        <div class="listPage__coffeeList__item__freeShipping">
                            <img src="../../images/Shipping.svg" alt=" Shipping svg">
                            <p>Free Shipping</p>
                        </div>
                        <div class="listPage__coffeeList__item__addCart changeAddCart">
                            <button coffeeNumber="${y.data().id}" machineColor="${y.data().color[0]}">BUY NOW</button>
                        </div>
                    </div>`)

                    y.data().color.forEach((stored) => {
                        $('.listPage__coffeeList__item:last-child').find(".listPage__coffeeList__item__colorPicker").append(`<button class=" listPage__coffeeList__item__colorPicker__${stored} checkColor" color="${stored}"></button>`);
                    })
                    $('.listPage__coffeeList__item:last-child').find(".checkColor:first-child").addClass("selectedColor")

                    for (let i = 0 + 1; i <= 5; i++) {
                        if (i <= y.data().stars) {
                            $('.listPage__coffeeList__item:last-child').find(".listPage__coffeeList__item__ratingSystem").append(`<span class="fa fa-star checked"></span>`);
                        } else {
                            $('.listPage__coffeeList__item:last-child').find(".listPage__coffeeList__item__ratingSystem").append(`<span class="fa fa-star"></span>`);
                        }
                    }
                    $('.listPage__coffeeList__item:last-child').find(".listPage__coffeeList__item__ratingSystem").append(`
                    <p>${y.data().ratingScore}</p>
                    <p>|</p>
                    <p>(${y.data().reviewNum})</p>
                    `);
                    checkColorListener();
                }, (error) => {
                    console.log("Error:", error);
                });
                addCoffeeCount();
                addToCartButtonListener();
            }, (error) => {
                console.log("Error:", error);
            });
}

let addToCartButtonListener = () => {
    $(".listPage__coffeeList__item__addCart>button").click(() => {
        let addid = $(event.target).attr("coffeeNumber");
        let addcolor = $(event.target).attr("machineColor");
        updateCartShow(addid, addcolor, 0, "add");
    });
}

// Minor function that counts number of coffee items that exist on the data base and displays number of coffee list page
let addCoffeeCount = () => {
    console.log("addCoffeeCount function has run. Output: ", $("#coffeeDisplay > div").length);
    $(".coffeeMakerCount").append($("#coffeeDisplay > div").length);
}

// listener function created to give collor buttons on the coffee listing a function to change the coffee's color
let checkColorListener = () => {
    $(".checkColor").click(() => {
        $(event.target).parent().children().removeClass("selectedColor")
        $(event.target).addClass("selectedColor");
        let id = $(event.target).parent().parent().attr("listNum");
        let color = $(event.target).attr("color");
        $(event.target).parent().prev().attr("src", `https://firebasestorage.googleapis.com/v0/b/personal-project-d1c24.appspot.com/o/img%2FCoffee${id + color}.png?alt=media&token=e08d42bf-c0da-4235-9692-7f4ae31298c7`);
        $(event.target).parent().parent().find(".listPage__coffeeList__item__addCart>button").attr("machineColor", color);
    })
}

let cartPageappend = async () => {
    let cartSubtotal = 0;
    let orderQTY = 0;
    let emptyCartPage = `<p style="margin-top:75px;">0 ITEM</p>
    <h1 style="margin-bottom:75px;">You don't have any items in your shopping cart</h1>`;
    console.log(JSON.stringify(coffeeCart));
    if (!coffeeCart.length) {
        $(".cartPage__content").html(emptyCartPage);

    } else {
        try {
            $(".cartPage__content__cartinfo__cartDisplay__container__coffeelist").empty();

            for (let i = 0; i < coffeeCart.length; i++) {
                await _db.collection('COFFEEMAKERS').where('id', '==', coffeeCart[i].id).get().then(async (querySnapshot) => {
                    console.log(querySnapshot.docs[0].data());
                    let subtotal = coffeeCart[i].qty * querySnapshot.docs[0].data().originalPrice;

                    $(".cartPage__content__cartinfo__cartDisplay__container__coffeelist").append(`
                        <div class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item" coffeeid="${querySnapshot.docs[0].data().id}" machinecolor="${coffeeCart[i].color}" listsubtotal="${subtotal}" unitprice="${querySnapshot.docs[0].data().originalPrice}" currentqty="${coffeeCart[i].qty}">
                            <div class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__left">
                                <div
                                    class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__left__image">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/personal-project-d1c24.appspot.com/o/img%2FCoffee${coffeeCart[i].id + coffeeCart[i].color}.png?alt=media&token=e08d42bf-c0da-4235-9692-7f4ae31298c7"
                                        alt="Coffee Machine">
                                </div>
                                <div
                                    class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__left__name">
                                    <h1>
                                        Keurig®</h1>
                                    <p> ${querySnapshot.docs[0].data().name} <span>(${coffeeCart[i].color})</span></p>
                                </div>
                            </div>
                            <div class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right">
                                <div
                                    class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__unitPrice">
                                    <p>${querySnapshot.docs[0].data().originalPrice} <span>each</span></p>
                                    <select class="testing">
                                        <option value="1" selected>1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>
                                <div
                                    class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal">
                                    <p class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal__number">$${subtotal}</p>
                                </div>
                            </div>
                            <div class="cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__close">
                                <p>Remove</p>
                                <i class="fa fa-times"></i>
                            </div>
                        </div>
                    `);
                    $('.cartPage__content__cartinfo__cartDisplay__container__coffeelist__item:last-child').find(".testing").val(`${coffeeCart[i].qty}`);
                    if (coffeeCart[i].qty == 10) {
                        $('.cartPage__content__cartinfo__cartDisplay__container__coffeelist__item:last-child').find(".cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal__number").addClass("maxqty");
                    }
                    cartSubtotal += subtotal;
                    orderQTY += coffeeCart[i].qty;
                });
            }
        } catch (error) {
            console.error("Retrieving data has failed Error: " + error);
            alert(error);
        } finally {
            cartPricingShow(cartSubtotal, orderQTY);
            addEventListerCartPageSelect();
            addEventListerCartPageRemove();
            $(".cartPage__content__cartinfo__total__container__addCoupon>h1").click(() => {
                document.getElementById("coupon").scrollIntoView();
            });
        }
    }

}

let cartPricingShow = (change, qty) => {
    let currentSubtotal = parseFloat($(".cartPage__content__cartinfo__total__container__subtotal>p>span").attr("subprice"));
    let newsubtotal = currentSubtotal + change;
    let tax = newsubtotal * .07;
    let orderTotal = newsubtotal + savings + shippingCost + tax;
    console.log("Current chang passover: ", change);
    console.log("Current subtotal: ", currentSubtotal);
    console.log("New subtotal: ", newsubtotal);
    console.log("Savings: ", savings);
    console.log("Shipping:", shippingCost);
    console.log("Tax:", tax);
    console.log("Order total:", orderTotal);
    $(".cartPage__content__cartinfo__total__container__subtotal>p>span").text(newsubtotal.toLocaleString('en-US', options));
    $(".cartPage__content__cartinfo__total__container__subtotal>p>span").attr("subprice", newsubtotal);
    if (coupon !== false) {
        $(".cartPage__content__cartinfo__total__container__savings>p>span").text(savings.toLocaleString('en-US', options));
    }
    if (orderTotal <= 35) {
        $(".cartPage__content__cartinfo__total__container__shipping>p").text("$" + shippingCost.toLocaleString('en-US', options));
    }
    $(".cartPage__content__cartinfo__total__container__tax>p>span").text(tax.toLocaleString('en-US', options));
    $(".cartPage__content__cartinfo__total__container__orderTotal>p>span").text(orderTotal.toLocaleString('en-US', options));

    let oldqty = parseInt($(".cartPage__content__cartinfo__total__container__subtotal>h1>span>span").text());

    let newqty = oldqty + qty;
    if (newqty === 1) {
        $(".cartPage__content__cartinfo__total__container__subtotal>h1>span").html("<span>" + newqty + "</span> item");
    } else {
        $(".cartPage__content__cartinfo__total__container__subtotal>h1>span").html("<span>" + newqty + "</span> items");
    }

}

let addEventListerCartPageSelect = () => {
    $("select").on('change', () => {
        let selected = $(event.target);
        let selectedParent = selected.parent().parent().parent();
        let newQty = selected.val();
        let newsubtotal = newQty * selectedParent.attr("unitprice");
        let previoussubtotal = selectedParent.attr("listsubtotal");
        let selectedid = selectedParent.attr("coffeeid");
        let selectedcolor = selectedParent.attr("machinecolor");
        let selectedqty = selectedParent.attr("currentqty");
        let totalDiff = newsubtotal - previoussubtotal;
        let qtyDiff = newQty - selectedqty;
        // console.log("Selected parent:", selectedParent);
        // console.log("New Qty:", newQty);
        // console.log("New Subtotal:", newsubtotal);
        // console.log("Previous Subtotal:", previoussubtotal);
        // console.log("New Total Diff:", totalDiff);
        // console.log("Selected ID:", selectedid);
        // console.log("Selected Color:", selectedcolor);
        // console.log("Selected qty:", selectedqty);
        selectedParent.find(".cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal__number").text("$" + newsubtotal.toLocaleString('en-US', options));
        selectedParent.attr("currentqty", newQty)
        selectedParent.attr("listsubtotal", newsubtotal)
        if (newQty == 10) {
            selectedParent.find(".cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal__number").addClass("maxqty");
        } else {
            selectedParent.find(".cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__right__subtotal__number").removeClass("maxqty");
        }
        updateCartShow(selectedid, selectedcolor, newQty, "updateCart");
        cartPricingShow(totalDiff, qtyDiff);
    });
}

let addEventListerCartPageRemove = () => {
    $(".cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__close>p , .cartPage__content__cartinfo__cartDisplay__container__coffeelist__item__close>i").click(() => {
        let selectedDiv = $(event.target).parent().parent();
        console.log(selectedDiv);
        let removeID = selectedDiv.attr("coffeeid");
        let removeColor = selectedDiv.attr("machinecolor");
        let removesubtotal = selectedDiv.attr("listsubtotal");
        let removeqty = selectedDiv.attr("currentqty");
        let totalDiff = 0 - removesubtotal;
        let qtyDiff = 0 - removeqty;
        console.log("Total Diff:", totalDiff);
        console.log("Qty Diff:", qtyDiff);
        console.log("Remove ID:", removeID);
        console.log("Remove Color:", removeColor);
        console.log("Remove qty", removeqty);
        cartPricingShow(totalDiff, qtyDiff);
        updateCartShow(removeID, removeColor, removeqty, "removeCart");
        selectedDiv.remove();
    });
}

//
let accountInfoHover = () => {
    let click = false;
    $(".keurigHeader__topNav__extraRight__account, .accountContainer__holder").hover(() => {
        if (bannerAd == true) {
            let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
            $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".accountContainer").css({ "display": "block", "top": top, });
            // $('html, body').css({
            //     overflow: 'hidden'
            // });
            loadInfo();
        } else {
            let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
            $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".accountContainer").css({ "display": "block", "top": top, });
            // $('html, body').css({
            //     overflow: 'hidden'
            // });
            loadInfo();
        }
        $(".keurigHeader__topNav__extraRight__account ").click(() => {
            click = true;
        })
        $(".accountContainer__close > i, .accountContainer__close > p,.grayOverlay").click(() => {
            click = false;
            $(".grayOverlay").css({ "display": "none" });
            $(".accountContainer").css({ "display": "none" });
            // $('html, body').css({
            //     overflow: 'auto'
            // });
        })
    }, () => {
        if (click == false) {
            $(".grayOverlay").css({ "display": "none" });
            $(".accountContainer").css({ "display": "none" });
            // $('html, body').css({
            //     overflow: 'auto'
            // });
        }
    });
}

let updateCartShow = (id, color, newqty, opperation) => {
    console.log("ran");
    found = false;
    if (!coffeeCart.length) {
        coffeeCart.push({
            id: parseInt(id),
            color: color,
            qty: 1
        })
        cartNumer();
        updateUserCart();
        console.log(coffeeCart);
    } else {
        for (let i = 0; i < coffeeCart.length; i++) {
            if (coffeeCart[i].id == id && coffeeCart[i].color == color && opperation == "updateCart") {
                coffeeCart[i].qty = parseInt(newqty);
                cartNumer();
                updateUserCart();
                found = true;
            } else if (coffeeCart[i].id == id && coffeeCart[i].color == color && opperation == "removeCart") {
                coffeeCart.splice(i, 1);
                cartNumer();
                if (coffeeCart.length == 0) {
                    MODEL.changeContent("cart", afterRoute);
                }
                updateUserCart();
                found = true;
            } else if (coffeeCart[i].id == id && coffeeCart[i].color == color && opperation == "add") {
                if (coffeeCart[i].qty != 10) {
                    coffeeCart[i].qty++;
                    cartNumer();
                    updateUserCart();
                } else {
                    console.log("You have reached maxed allowed");
                };
                found = true;
            } else if (coffeeCart.length - 1 == i && found == false) {
                console.log("add Coffee");
                coffeeCart.push({
                    id: parseInt(id),
                    color: color,
                    qty: 1
                })
                cartNumer();
                updateUserCart();
                console.log(coffeeCart);
                break;
            }
        }
    }
}

let updateUserCart = async () => {
    if (loginStatus == true) {
        console.log("add cart to user database!");
        console.log(loggedUser);
        _db.collection("USERS").doc(loggedUser.id).update({
            cart: coffeeCart
        }).then(() => {
            console.log("Document successfully updated!");
        })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
    } else {
        localStorage.setItem("coffeeCart", JSON.stringify(coffeeCart));
    }
}

//
let loadInfo = () => {
    $(".accountContainer__info__span").text(loggedUser.fname, " ", loggedUser.lname);
    $(".accountContainer__info__email").text(loggedUser.email);
    $(".accountContainer__info__uid").text(loggedUser.id);
    $(".accountContainer__info__specials").text(loggedUser.specials);
}

// function that takes care of loding and hidding the gray overlay the pops up when user tried to sign in or access search bar
let accountHover = () => {
    let click = false;
    $(".keurigHeader__topNav__extraRight__profile,.loginContainer ").hover(() => {
        if (bannerAd == true) {
            let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
            $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".loginContainer").css({ "display": "block", "top": top, });
            // $('html, body').css({
            //     overflow: 'hidden'
            // });
            accountModal();
            console.log(1);
        } else {
            let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
            $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".loginContainer").css({ "display": "block", "top": top, });
            // $('html, body').css({
            //     overflow: 'hidden'
            // });
            accountModal();
            console.log(2);
        }
        $(".keurigHeader__topNav__extraRight__profile,.inputEnter,.chec ").click(() => {
            click = true;
        })
        $(".loginContainer__close > i, .loginContainer__close > p,.grayOverlay ,.loginContainer__formsSignup__signUp,.loginContainer__formsLogin__signIn ").click(() => {
            click = false;
            $(".grayOverlay").css({ "display": "none" });
            $(".loginContainer").css({ "display": "none" });
            // $('html, body').css({
            //     overflow: 'auto'
            // });
        })


    }, () => {
        if (click == false) {
            $(".grayOverlay").css({ "display": "none" });
            $(".loginContainer").css({ "display": "none" });
            // $('html, body').css({
            //     overflow: 'auto'
            // });
        }
    })

}

//

// Modal create for user to create a new account using an email and password
let accountModal = () => {
    $(".loginContainer__options__logIn, .loginContainer__options__signUp").click(() => {
        $(event.target).parent().children().removeClass("lCSelected")
        $(event.target).addClass("lCSelected");
        let value = $(event.target).attr("value")
        switch (value) {
            case "signUp":
                $(".loginContainer__formsSignup").css("display", "block");
                $(".loginContainer__formsSignUpInformation").css("display", "flex");
                $(".loginContainer__formsLogin").css("display", "none");
                $(".loginContainer__formsLoginInformation").css("display", "none");
                break;
            case "logIn":
                $(".loginContainer__formsLogin").css("display", "block");
                $(".loginContainer__formsLoginInformation").css("display", "flex");
                $(".loginContainer__formsSignup").css("display", "none");
                $(".loginContainer__formsSignUpInformation").css("display", "none");
                break;

        }
    });
}

// function to sign up
let signup = () => {
    let fname = $("#fname-Signup").val().trim();
    let lname = $("#lname-Signup").val().trim();
    let email = $("#email-Signup").val().trim();
    let password = $("#password-Signup").val().trim();
    let specials = $("#checkboxSpecials").is(':checked');
    let remember = $("#checkboxKeep").is(':checked');
    console.log(fname, fname, email, password, specials, remember);

    if (remember == true) {
        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        $("#fname-Signup").val("");
                        $("#lname-Signup").val("");
                        $("#email-Signup").val("");
                        $("#password-Signup").val("");
                        _db
                            .collection("USERS")
                            .doc(`${userCredential.user.uid}`)
                            .set({
                                id: userCredential.user.uid,
                                fname: fname,
                                lname: lname,
                                email: email,
                                password: password,
                                specials: specials,
                                cart: []
                            })
                            .then(() => {
                                console.log("Signup: Document has successfully been written!");
                                loginStatus = true;
                            })
                            .catch((error) => {
                                console.error("SignUp: Error writing document: ", error);
                            });
                        console.log(userCredential.user);
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        alert(errorCode + " " + errorMessage);
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
    } else {
        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        $("#fname-Signup").val("");
                        $("#lname-Signup").val("");
                        $("#email-Signup").val("");
                        $("#password-Signup").val("");
                        _db
                            .collection("USERS")
                            .doc(`${userCredential.user.uid}`)
                            .set({
                                id: userCredential.user.uid,
                                fname: fname,
                                lname: lname,
                                email: email,
                                password: password,
                                specials: specials,
                                cart: []
                            })
                            .then(() => {
                                console.log("Signup: Document has successfully been written!");
                                loginStatus = true;
                            })
                            .catch((error) => {
                                console.error("SignUp: Error writing document: ", error);
                            });
                        console.log(userCredential.user);
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        alert(errorCode + " " + errorMessage);
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
    }
}

let login = () => {
    let email = $("#email-login").val();
    let pass = $("#password-Login").val();
    let remember = $("#checkboxRemeber").is(':checked');

    if (remember == true) {
        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                return firebase
                    .auth()
                    .signInWithEmailAndPassword(email, pass)
                    .then(() => {
                        $("#email-login").val("")
                        $("#password-Login").val("")
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        alert(errorCode + " " + errorMessage);
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
    } else {
        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return firebase
                    .auth()
                    .signInWithEmailAndPassword(email, pass)
                    .then(() => {
                        $("#email-login").val("")
                        $("#password-Login").val("")
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        alert(errorCode + " " + errorMessage);
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
    }
}

let signoutClick = () => {
    $(".keurigHeader__topNav__extraRight__signOut").click(() => {
        firebase.auth().signOut().then(() => {
            console.log("signoutClick: Signed Out");
            loginStatus = false;
            loggedUser = null;
            console.log(coffeeCart);
            $(".grayOverlay").css({ "display": "none" });
            $(".accountContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
            alert("You've been successfully logged out! ");
        }).catch((error) => {
            console.log("signoutClick Error Occured:", error);
        })
    });
}

// A function that contains a list of functions I want running before hashing the page
let commands2LoadBeforePageHash = () => {
    debugCommands();
    accountHover();
    accountInfoHover();
    signoutClick();
    searchBarListener();
    checkBanner();
    setFooterHeight();
}

// Firebase command that will run at start to see if user credentals already exist on the web browser. If so to store them into local storage.
let initFirebase = async (callback) => {
    commands2LoadBeforePageHash();
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log("User is logged in");
            $(".keurigHeader__topNav__extraRight__signOut").css("display", "flex");
            $(".keurigHeader__topNav__extraRight__account").css("display", "flex");
            $(".keurigHeader__topNav__extraRight__profile").css("display", "none");
            await _db.collection("USERS").doc(user.uid).get().then(async (doc) => {
                console.log(doc.data());
                loginStatus = true;
                loggedUser = doc.data();
                if (doc.data().cart.length == 0 && localStorage.getItem("coffeeCart") != 0) {
                    await _db.collection("USERS").doc(loggedUser.id).update({
                        cart: JSON.parse(localStorage.getItem("coffeeCart"))
                    }).then(async () => {
                        await _db.collection("USERS").doc(loggedUser.id).get().then((cart) => {
                            coffeeCart = cart.data().cart;
                            console.log(cart.data().cart);
                            localStorage.setItem("coffeeCart", []);
                        })
                    }).catch((error) => {
                        console.log("Error updating documents: ", error);
                        alert("Following error has occured:", error);
                    })
                    cartNumer();
                    if (!alreadyRunning) {
                        callback();
                    } else {
                        route();
                    }
                } else {
                    console.log(loginStatus);
                    console.log(loggedUser);
                    coffeeCart = doc.data().cart;
                    cartNumer();
                    if (!alreadyRunning) {
                        callback();
                    } else {
                        route();
                    }
                }
            }).catch((error) => {
                console.log("Error getting documents: ", error);
                alert("Following error has occured:", error);
            })
        } else {
            console.log("User is not logged in");
            $(".keurigHeader__topNav__extraRight__signOut").css("display", "none");
            $(".keurigHeader__topNav__extraRight__account").css("display", "none");
            $(".keurigHeader__topNav__extraRight__profile").css("display", "flex");
            loginStatus = false;
            loggedUser = null;
            if (!localStorage.getItem("coffeeCart").length == 0) {
                coffeeCart = JSON.parse(localStorage.getItem("coffeeCart"));
            } else {
                coffeeCart = []
            }
            cartNumer();
            if (!alreadyRunning) {
                callback();
            } else {
                route();
            }
        }
    })
}

// functions that will run at the start of out website. As soon as the dom loads all the intial functions begin to run.
$(document).ready(() => {
    if (!localStorage.getItem("coffeeCart")) {
        localStorage.setItem("coffeeCart", [])
    }
    try {
        let app = firebase.app();
        _db = firebase.firestore();
        initFirebase(checkHash)
    } catch (e) {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
})



