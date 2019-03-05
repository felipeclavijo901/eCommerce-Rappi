//Create Necessary Functions
function filterProducts(jSON, cookie, container){

    //Create necessary variables
    var result = [];

    //Get filter
    var filter = cookie.getCookie();

    //Validate Filter
    if(filter){

        //Show search field
        $("#search").css("display", "block");

        //Travel JSON
        $.each(jSON, function(index, value){

            var filterValue = true;

            //Validate Filters
            $.each(filter, function(indexF, valueF){

                filterValue = validateFilters(valueF["typeFilter"], value[indexF], valueF["value"], filterValue)
            });

            //Add result
            if(filterValue == true){
                value["position"] = index;
                result.push(value);
            }
        });
    }

    showProducts(result, container);
    return result;
}

function validateFilters(typeFilter, value, compareValue, result){

    //Validate filters condition
    switch(typeFilter){

        case "equal":

            if(value != compareValue){
                result = false;
            }
            break;

        case "like":

            if(value.toLowerCase().indexOf(compareValue.toLowerCase()) == -1){
                result = false;
            }
            break;

        case "smallerThan":
            
            if(limpiarKey(value) > compareValue){
                result = false;
            }
            break;

        case "not":

            if(value.toString() == compareValue.toString()){
                result = false;
            }
            break;
        default:
            break;
    }

    return result;
}

function showProducts(array, container){

    //Clean container
    container.html("");

    //Create and show products
    $.each(array, function(index, value){
        
        var product = new Product(value);
        container.append(product.createObject());
    });

    //Clear both object
    container.append("<div class='clearBoth'></div>");
}

function Product(object){
    this.product = object;

    this.createObject = function(){

        //Create necessary objects
        var divContainer = $("<div>");
        var divName = $("<div>");
        var divPrice = $("<div>");
        var divQuantity = $("<div>");
        var divActions = $("<div>");
        var purchase = $("<button>");

        //Assign attributes
        
        //Validate availability
        if(!this.product.available){
            divContainer.addClass("panel-danger");
            purchase.addClass("disabled");
        }else{
            divContainer.addClass("panel-success");
        }

        //Assign attributes
        divContainer.addClass("panel");
        divContainer.addClass("productContainer");
        divContainer.attr({"data-id": this.product.id, "data-sublevel_id": this.product.sublevel_id});
        divName.attr("class", "data panel-heading");
        divName.html(this.product.name);
        divPrice.attr("class", "data panel-body");
        divPrice.html(this.product.price);
        divQuantity.attr("class", "data panel-body");
        divQuantity.html(this.product.quantity);
        purchase.addClass("btn btn-primary purchase");
        purchase.append("Agregar al Carrito");
        purchase.attr({"data-position": this.product.position, "data-object": JSON.stringify(this.product), "onclick": "Purchase(this);"});
        divActions.attr("class", "data panel-body");


        //Add objects
        divActions.append(purchase);
        divContainer.append(divName, divQuantity, divPrice, divActions);

        return divContainer;
    }

    this.createCartObject = function(){

        //Create necessary objects
        var divContainer = $("<div>");
        var divName = $("<div>");
        var cross = $("<strong>");
        var spanName = $("<strong>");
        var spanQuantity = $("<strong>");
        var divPrice = $("<div>");
        var divActions = $("<div>");
        var remove = $("<button>");

        //Assign attributes
        divContainer.attr({"id": this.product.id, "class": "cartProduct"});
        spanName.addClass("name");
        spanName.html(this.product.name);
        cross.html("x");
        spanQuantity.html(1);
        spanQuantity.addClass("quantity");
        divPrice.addClass("price");
        divPrice.html(this.product.price);
        remove.addClass("btn btn-danger removeCart");
        remove.attr("onclick", "deleteElementPurchase(this);");
        remove.html("Eliminar");

        //Add Objects
        divName.append(spanName, cross, spanQuantity);
        divActions.append(remove);
        divContainer.append(divName, divPrice, divActions);

        return divContainer;
    }
}

function createMenu(jSON, object){

    //Travel JSON
    $.each(jSON, function(index, value){

        //Create objects
        var li = $("<li>");
        var a = $("<a>");

        //Assign attributes
        a.attr({"data-id": value["id"], "data-name": value["name"], "href": "#" + value["name"]});
        a.html(value["name"]);

        //Validate SubMenu
        if(value["sublevels"]){

            //Create Objects
            var ul = $("<ul>");

            //Assign Attributes
            li.attr("class", "dropdown dropdown-submenu");
            a.attr({"class": "dropdown-toggle", "data-toggle": "dropdown"});
            ul.addClass("dropdown-menu");

            //Add Objects
            li.append(a);
            li.append(ul);
            object.append(li);
            
            //Create Sub-Menu
            createMenu(value["sublevels"], ul);
        }else{

            //Assign Attributes
            a.addClass("filter");

            //Add Objects
            li.append(a);
            object.append(li);
        }
    });
}

function alerts(type, title, message, automaticClosing){

    //Create Objects
    var div = $("<div>");
    var a = $("<a>");
    var strong = $("<strong>");
    var divText = $("<div>");

    //Assign Attributes
    div.attr("class", "alerts alert alert-" + type + " alert-dismissible fade in");
    div.hide();
    a.attr({"href": "#", "class": "close", "data-dismiss": "alert", "aria-label": "close"});
    a.html("&times;");
    strong.html(title);
    divText.html(message);

    //Add Objects
    div.append(strong, a, divText);

    //Show Object
    $("section").append(div);
    div.slideDown(300);

    //Validate automatic closing
    if(automaticClosing){

        //Close
        setTimeout(function(){
            div.fadeOut("slow", function(){
                this.remove();
            });
        }, 1500);
    }
}


class CookiesClass {
    constructor(nameCookie) {

        this.nameCookie = nameCookie;
    }

    addDataCookie(addInfo, type="JSON") {

        //Get cookie data
        var info = this.getCookie(this.nameCookie);

        //Join JSONs
        var newInfo = $.extend({}, info, addInfo);

        //Modify Coockie
        this.setCookie(newInfo);
    };

    getCookie() {

        //validate Cookie
        if($.cookie(this.nameCookie)){

            //Get cookie data and parse JSON
            return JSON.parse($.cookie(this.nameCookie));
        }else{

            return null;
        }
    };

    setCookie(value, expires = null) {

        $.cookie(this.nameCookie, JSON.stringify(value), expires);
    };

    removeDataCookie(nameRemove){

        //Get cookie data
        var info = this.getCookie(this.nameCookie);

        //Remove data
        if(info[nameRemove])
            delete info[nameRemove];

        //Modify Coockie
        this.setCookie(info);
    };

    removeCookie(){

        $.removeCookie(this.nameCookie);
    };
}

function loadFunction(products, cookieFilter, cookieOrder, container){

    //Get Necesaria Data
    var filter = cookieFilter.getCookie();
    var cookieCart = new CookiesClass("cart");


    console.log(cookieCart.getCookie());
    console.log(cookieFilter.getCookie());
    console.log(cookieOrder.getCookie());


    //Show data filter
    if(filter){
        if(filter["price"]){
            $("#priceControlRange").val(filter["price"]["value"]);
            $("#priceControlRange").siblings(".valueRange").html(filter["price"]["value"]);
        }
        if(filter["quantity"]){
            $("#quantityControlRange").val(filter["quantity"]["value"]);
            $("#quantityControlRange").siblings(".valueRange").html(filter["quantity"]["value"]);
            $("#categorie span").html(filter["sublevel_id"]["name"]);
        }
        if(filter["sublevel_id"]){
            $("#categorie span").html(filter["sublevel_id"]["name"]);
        }
        if(filter["available"]){
            $(".skip[data-value='" + filter["available"]["value"] + "']").attr("class", "btn btn-danger skip");
        }
    }

    //Cart Show
    $.each(cookieCart.getCookie(), function(index, value){
        
        $.each(value, function(index1, value1){

            console.log(value1);

            var purchase = new Purchase(null);
            purchase.addElement(value1, false);
        });
    });

    //Calculate total price
    calculateCartTotalPrice();

    //Filter Products
    var filterProductsArray = filterProducts(products["products"], cookieFilter, container);
    orderProducts(filterProductsArray, cookieOrder, container);

    //Size Window
    sizeWindow();

    //Event Resize
    $(window).resize(function(){

        //Size Window
        sizeWindow();
    });

    return filterProductsArray;
}

function sizeWindow(){
    
    //Size Window
    $("body").css("min-height", $(window).height());
    $("nav").css("min-height", $(window).height() * 0.1);
    $("section").css("min-height", $(window).height() * 0.7);
    $("footer").css("min-height", $(window).height() * 0.2);
}

function orderProducts(array, cookie, container){

    //Create necessary variables
    var jSON = {};
    var newArray = [];
    var order = cookie.getCookie();

    //Validate Order
    if(order){

        //Restructure JSON
        $.each(array, function(index, value){

            var key = limpiarKey(value[order["parameter"]]);

            if(!jSON[key]){
                jSON[key] = [];
            }
            jSON[key].push(value);
        });

        //Order
        switch (order["order"]){
            case "menorMayor":
                Object.keys(jSON).sort(function(a, b){ if(parseFloat(a) != NaN){ return a - b; } }).forEach(function(key) {
                    
                    $.each(jSON[key], function(index, value){
                        newArray.push(value);
                    });
                });
                break;

            case "mayorMenor":
                Object.keys(jSON).sort(function(a, b){ if(parseFloat(a) != NaN){ return b - a; } }).forEach(function(key) {
                        
                    $.each(jSON[key], function(index, value){
                        newArray.push(value);
                    });
                });
                break;
        }

        showProducts(newArray, container);
    }
}

function limpiarKey(key){

    if(typeof key == "boolean"){

        var key = key ? "1" : "0";

    }else if(typeof key != "number" && typeof key != "boolean"){

        key = key.replace("$", "");
        key = key.replace(",", "");
        
        if(parseFloat(key) != NaN){
            
            key = parseFloat(key);
        }
    }

    return key;
}

function skip(cookie, object){

    //Get necessary data
    var filter = cookie.getCookie();
    var newAvailability = object.attr("data-value");

    //Validate old availability
    var oldAvailability;
    if(filter)
        if(filter["available"]){
            var oldAvailability = filter["available"]["value"];
        }

    if(oldAvailability == newAvailability){

        cookie.removeDataCookie("available");
        object.attr("class", "btn btn-success skip");
        object.siblings(".skip").attr("class", "btn btn-success skip");
    }else{

        cookie.addDataCookie({"available": {"value": newAvailability, "typeFilter": "not"}});
        object.attr("class", "btn btn-danger skip");
        object.siblings(".skip").attr("class", "btn btn-success skip");
    }
}

function Purchase(object){

    this.object = object;

    //Necessary Methods
    this.addElement = function(object, cookie = true){

        //Create product
        var product = new Product(object);

        //Validat first element
        if($("#containerCartProducts").find(".cartProduct").length == 0){

            //Empty container
            $("#containerCartProducts").html("");
        }

        //Validate first product
        if($("#containerCartProducts").find("#" + object.id).length == 0){

            //Add to cart
            $("#containerCartProducts").append(product.createCartObject());
        }else{

            //Get quantity
            var quantity = $("#containerCartProducts").find("#" + object.id).find(".quantity").html();

            //Increase quantity
            quantity = parseInt(quantity) + 1;

            //Set quantity
            $("#containerCartProducts").find("#" + object.id).find(".quantity").html(quantity);

        }

        //Create elemen cookie
        if(cookie){
                
            this.cookieCart = new CookiesClass("cart");
            var cookieData = this.cookieCart.getCookie();

            if(cookieData){

                if(cookieData[object.id]){
                    console.log(cookieData);
                    console.log(1);
                    var nextKey = Object.keys(cookieData[object.id]).length;

                    console.log(Object.keys(cookieData[object.id]));

                    cookieData[object.id][nextKey] = object;
                }else{
                    
                    cookieData[object.id] = [];
                    cookieData[object.id][0] = object;
                }
            }else{

                var cookieData = {};
                cookieData[object.id] = [];
                cookieData[object.id][0] = object;
            }

            //Storage persistent data
            this.cookieCart.setCookie(cookieData);
        }

        //Count purchase elements
        calculateCartTotalPrice();
    }

    //Validate availability
    if(this.object != null){
        if($(this.object).hasClass("disabled") == false){

            //Intance Object
            var object = JSON.parse($(this.object).attr("data-object"));

            //Add element to cart
            this.addElement(object);

            //Message
            alerts("success", "Agregado!", "Se ha agregado con éxito el producto al carrito de compras", true);
        }
    }
}

function deleteElementPurchase(object){

    //Get necessary data
    var parent = $(object).parents(".cartProduct");
    var id = parent.attr("id");
    var quantity = $(".quantity", parent).html();
    var cookieCart = new CookiesClass("cart");
    var purchaseObjects = cookieCart.getCookie();
    var deleteId = quantity - 1;

    console.log(purchaseObjects);

    if(quantity > 1){

        $(".quantity", parent).html(quantity - 1);
    }else{

        parent.remove();
    }

    //Delete element
    var objectProducts = purchaseObjects[id];
    delete purchaseObjects[id];
    delete objectProducts[deleteId];
    objectProducts.length = objectProducts.length - 1;

    purchaseObjects[id] = objectProducts;

    //Storage persistent data
    cookieCart.setCookie(purchaseObjects);

    //Count purchase elements
    calculateCartTotalPrice();

    //Message
    alerts("danger", "Eliminado!", "Se ha eliminado con éxito el producto del carrito de compras", true);
}

function calculateCartTotalPrice(){

    var totalPrice = 0;
    var validateCartProducts = $("#containerCartProducts .cartProduct").length;

    if(validateCartProducts > 0){
        $("#containerCartProducts .cartProduct").each(function(){

            //Get necessary data
            var quantity = limpiarKey($(".quantity", this).html());
            var price = limpiarKey($(".price", this).html());

            totalPrice += quantity * price;
        });
    }else{

        $("#containerCartProducts").html("Por favor agregar algún producto al carrito.");
    }

    $("#cartContainer #totalCart span").html(totalPrice);
}