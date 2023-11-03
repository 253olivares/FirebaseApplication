var _db
var bannerAd = true;
var topNav;

var coffeeCart = [];

// function creates an event listener that keeps track of our url address to check for any changes
// The first line creates the listener and the second long runs the route function for the first time to land us on the homepage.
let checkHash = () => {
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
        case "coffee":
            MODEL.changeContent(pageID, afterRoute);
            break;
        default:
            if (pageID.length == 0) {
                MODEL.changeContent("home", afterRoute);
                console.log("First load blank");
            } else {
                MODEL.changeContent("404", afterRoute);
                console.log("url us invalid or empty taken back to home");
            }
            break
    }
}

let setAppHeight = () => {
    $("#app").css("height", $("#app").height());
}

let addCoffeeCount = () => {
    console.log($("#coffeeDisplay > div").length);
    $(".coffeeMakerCount").append($("#coffeeDisplay > div").length);;
}

// function to run any script after redirection to a new page
let afterRoute = (page) => {

    switch (page) {
        case "home":
            console.log("You are on the home page!");
            break;
        case "coffee":
            console.log("you are on the coffee page!");
            loadMachine();

            break;
        case "cart":
            console.log("you are on the cart page!");

            break;
    }

}

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
        console.log("no local storeage banner!");
    }
}
let debugCommands = () => {

    // press C to clear sessionStorage
    $(document).keydown((e) => {
        if (e.which == 67) {
            sessionStorage.clear();
            $(".bannerAd").removeClass("test");
            $(".bannerAd").css("display", "flex");
            bannerAd = true;
        }
        console.log(e.which);
    })
}
let setFooterHeight = () => {
    $(".content-wrap").css("padding-bottom", $(".footer").height())
}
let checkColorListener = () => {
    $(".checkColor").click(() => {
        $(event.target).parent().children().removeClass("selectedColor")
        $(event.target).addClass("selectedColor");
        let id = $(event.target).parent().parent().attr("listNum");
        let color = $(event.target).attr("color");
        $(event.target).parent().prev().attr("src", `https://firebasestorage.googleapis.com/v0/b/personal-project-d1c24.appspot.com/o/img%2FCoffee${id + color}.png?alt=media&token=e08d42bf-c0da-4235-9692-7f4ae31298c7`);;
    })
}

let loadMachine = (docs) => {
    machineid = "";
    $("#coffeeDisplay").empty();
    _db
        .collection("COFFEEMAKERS")
        .get()
        .then(
            (x) => {
                console.log(x);
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
                            <button coffeeNumber="${y.data().id}">BUY NOW</button>
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
            }, (error) => {
                console.log("Error:", error);
            });
}

let grayOverlay = () => {
    let click = false;
    $(".keurigHeader__topNav__extraRight__profile,.loginContainer ").hover(() => {
        if (bannerAd == true) {
            let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
            console.log("Banner Height:", $(".bannerAd").height());
            console.log("Top Nav Height:", $(".keurigHeader__topNav").height());
            console.log("Padding Height:", parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom")));
            $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".loginContainer").css({ "display": "block", "top": top, });
            $('html, body').css({
                overflow: 'hidden'
            });
            accountModal();

            console.log(1);
        } else {
            let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
            console.log("Banner Height:", $(".bannerAd").height());
            console.log("Top Nav Height:", $(".keurigHeader__topNav").height());
            console.log("Padding Height:", parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom")));
            $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".loginContainer").css({ "display": "block", "top": top, });
            $('html, body').css({
                overflow: 'hidden'
            });
            accountModal();

            console.log(2);
        }
        $(".keurigHeader__topNav__extraRight__profile,.inputEnter,.chec ").click(() => {
            click = true;
        })
        $(".loginContainer__close > i, .loginContainer__close > p,.grayOverlay ").click(() => {
            click = false;
            $(".grayOverlay").css({ "display": "none" });
            $(".loginContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
        })


    }, () => {
        if (click == false) {
            $(".grayOverlay").css({ "display": "none" });
            $(".loginContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
        }
    })

}

let accountModal = () => {
    $(".loginContainer__options__logIn, .loginContainer__options__signUp").click(() => {
        console.log(event.target);
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

// functions that will run at the start of out website. As soon as the dom loads all the intial functions begin to run.
$(document).ready(() => {
    try {
        let app = firebase.app();
        _db = firebase.firestore();
        checkHash();
        checkBanner();
        grayOverlay();
        debugCommands();
        setFooterHeight();
    } catch (e) {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
})



