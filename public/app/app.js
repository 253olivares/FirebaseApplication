var _db
var bannerAd = true;
let emptyCartPage = `<p>0 ITEM</p>
    <h1>You don't have any items in your shopping cart</h1>`;
var topNav;
var loginStatus = false;
var loggedUser;

var coffeeCart = [];

// debug commands that I create for debugging
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
            checkCartPage();
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

// function that sets footer high
let setFooterHeight = () => {
    $(".content-wrap").css("padding-bottom", $(".footer").height())
}

let cartNumer = () => {
    console.log("cartNumber:Running");
    try {
        if (coffeeCart.length >= 1) {
            console.log("cartnumber functution has run and has found array has more than one");
            $(".keurigHeader__topNav__extraRight__cart__count").css("display", "inline-block");
            $(".keurigHeader__topNav__extraRight__cart__count").html(coffeeCart.length);
        } else {
            console.log("cartnumber functution has run and has found arrary has none");
            $(".keurigHeader__topNav__extraRight__cart__count").css("display", "none");
        }
    } catch {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
}

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
                            <button coffeeNumber="${y.data().id}" onclick="addCoffee2Cart(${y.data().id})">BUY NOW</button>
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

// Minor function that counts number of coffee items that exist on the data base and displays number of coffee list page
let addCoffeeCount = () => {
    console.log("addCoffeeCount function has run. Output: ", $("#coffeeDisplay > div").length);
    $(".coffeeMakerCount").append($("#coffeeDisplay > div").length);;
}

// listener function created to give collor buttons on the coffee listing a function to change the coffee's color
let checkColorListener = () => {
    $(".checkColor").click(() => {
        $(event.target).parent().children().removeClass("selectedColor")
        $(event.target).addClass("selectedColor");
        let id = $(event.target).parent().parent().attr("listNum");
        let color = $(event.target).attr("color");
        $(event.target).parent().prev().attr("src", `https://firebasestorage.googleapis.com/v0/b/personal-project-d1c24.appspot.com/o/img%2FCoffee${id + color}.png?alt=media&token=e08d42bf-c0da-4235-9692-7f4ae31298c7`);;
    })
}

let addCoffee2Cart = (id) => {
    let targetItem = $(event.target).parent().parent()
    console.log("addCoffee2Cart page has ran. Output: ", targetItem.attr("listNum"));
    if (sessionStorage.login == false) {

    } else {

    }

}

let checkCartPage = () => {
    if (coffeeCart.length >= 1) {

    } else {
        $(".cartPage__content").html(emptyCartPage);
    }
}

let accountInfoHover = () => {
    let click = false;
    $(".keurigHeader__topNav__extraRight__account, .accountContainer").hover(() => {
        if (bannerAd == true) {
            let top = $(".bannerAd").height() + $(".keurigHeader__topNav").height() - 5 - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom"));
            $(".grayOverlay ").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".accountContainer").css({ "display": "block", "top": top, });
            $('html, body').css({
                overflow: 'hidden'
            });
            loadInfo();
        } else {
            let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
            $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".accountContainer").css({ "display": "block", "top": top, });
            $('html, body').css({
                overflow: 'hidden'
            });
            loadInfo();
        }
        $(".keurigHeader__topNav__extraRight__account ").click(() => {
            click = true;
        })
        $(".accountContainer__close > i, .accountContainer__close > p,.grayOverlay").click(() => {
            click = false;
            $(".grayOverlay").css({ "display": "none" });
            $(".accountContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
        })
    }, () => {
        if (click == false) {
            $(".grayOverlay").css({ "display": "none" });
            $(".accountContainer").css({ "display": "none" });
            $('html, body').css({
                overflow: 'auto'
            });
        }
    });
}

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
            $('html, body').css({
                overflow: 'hidden'
            });

            console.log(1);
        } else {
            let top = $(".keurigHeader__topNav").height() - parseInt($(".keurigHeader__topNav__extraRight__profile").css("padding-bottom") - 5);
            $(".grayOverlay").css({ "display": "block", "top": top, "height": `calc(100% - ${top}px)` });
            $(".loginContainer").css({ "display": "block", "top": top, });
            $('html, body').css({
                overflow: 'hidden'
            });

            console.log(2);
        }
        $(".keurigHeader__topNav__extraRight__profile,.inputEnter,.chec ").click(() => {
            click = true;
        })
        $(".loginContainer__close > i, .loginContainer__close > p,.grayOverlay ,.loginContainer__formsSignup__signUp,.loginContainer__formsLogin__signIn ").click(() => {
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

let signoutClick = () => {
    $(".keurigHeader__topNav__extraRight__signOut").click(() => {
        firebase.auth().signOut().then(() => {
            console.log("signoutClick: Signed Out");
            loginStatus = false;
            MODEL.changeContent("home", afterRoute);
        })
            .catch((error) => {
                console.log("signoutClick Error Occured:", error);
            })
    });
}
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

// Firebase command that will run at start to see if user credentals already exist on the web browser. If so to store them into local storage.
let initFirebase = (callback) => {
    commands2LoadBeforePageHash();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is logged in");
            _db.collection("USERS")
                .where("email", "==", user.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        loginStatus = true;
                        loggedUser = doc.data();
                        coffeeCart = doc.data().cart;
                        console.log("initFirebase", loginStatus);
                        console.log("initFirebase", loggedUser);
                        cartNumer();
                    });
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                })
            $(".keurigHeader__topNav__extraRight__signOut").css("display", "flex");
            $(".keurigHeader__topNav__extraRight__account").css("display", "flex");
            $(".keurigHeader__topNav__extraRight__profile").css("display", "none");

        } else {
            console.log("User is not logged in");
            $(".keurigHeader__topNav__extraRight__signOut").css("display", "none");
            $(".keurigHeader__topNav__extraRight__account").css("display", "none");
            $(".keurigHeader__topNav__extraRight__profile").css("display", "flex");
            loginStatus = false;
            loggedUser = null;
            coffeeCart = [];
            cartNumer();
        }
    })
    callback();
}

// functions that will run at the start of out website. As soon as the dom loads all the intial functions begin to run.
$(document).ready(() => {
    try {
        let app = firebase.app();
        _db = firebase.firestore();
        initFirebase(checkHash)
    } catch (e) {
        console.error("Document.ready has failed Error: " + e);
        alert(e);
    }
})



