$(function(){

    //Store persistent data
    const cookieFilter = new CookiesClass("filter");
    const cookieOrder = new CookiesClass("order");

    //Load JSONs
    var categories = {};
    var products = {};
    $.ajax({
        url: "json/categories.json",
        dataType: "json",
        async: false,
        success: function(data){
            categories = data;
        }
    });
    $.ajax({
        url: "json/products.json",
        dataType: "json",
        async: false,
        success: function(data){
            products = data;
        }
    });

    //Load Function
    var container = $("#productsContainer");
    var filterProductsArray = loadFunction(products, cookieFilter, cookieOrder, container);

    //Create menu
    createMenu(categories["categories"], $("#principalMenu"));

//Assign Events
    //Menu
    $('ul .dropdown-menu [data-toggle=dropdown]').on('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });

    //Click filter
    $(".filter").on("click", function(event){

        event.preventDefault();
        event.stopPropagation();

        $('nav .open').removeClass('open');

        //Get necessary data
        var value = $(this).attr("data-id");
        var name = $(this).attr("data-name");

        //Store persistent data
        cookieFilter.addDataCookie({"sublevel_id": {"value": value, "name": name, "typeFilter": "equal"}});

        //Instance Object
        var container = $("#productsContainer");

        //Filter products
        filterProductsArray = filterProducts(products["products"], cookieFilter, container);
        $("#categorie span").html(name);

        //Order Products
        orderProducts(filterProductsArray, cookieOrder, container);
    });

    //Search filter
    $("#search input[type='text']").on("keyup focusout", function(){

        //Add new filter
        cookieFilter.addDataCookie({"name": {"value": this.value, "typeFilter": "like"}});

        //Filter
        filterProductsArray = filterProducts(products["products"], cookieFilter, container);

        //Order Products
        orderProducts(filterProductsArray, cookieOrder, container);
    });

    //Range filter
    $(".range input[type='range']").on("mousemove change", function(){

        //Get necessary data
        var value = $(this).val();
        var parameterValue = $(this).attr("data-parameter");
        var object = {};
        object[parameterValue] = {"value": value, "typeFilter": "smallerThan"};

        //Add new filter
        cookieFilter.addDataCookie(object);

        //Filter
        filterProductsArray = filterProducts(products["products"], cookieFilter, container);

        //Order Products
        orderProducts(filterProductsArray, cookieOrder, container);

        //Show value
        $(this).siblings(".valueRange").html(value);
    });

    //Click order
    $(".order").on("click", function(){

        //Get necessary data
        filterProductsArray = filterProducts(products["products"], cookieFilter, container);
        cookieOrder.setCookie({"parameter": $(this).attr("data-parameter"), "order": $(this).attr("data-order")});

        //Order Products
        orderProducts(filterProductsArray, cookieOrder, container);
    });

    //Click skip
    $(".skip").on("click", function(){

        skip(cookieFilter, $(this));

        //Filter products
        filterProductsArray = filterProducts(products["products"], cookieFilter, container);

        //Order Products
        orderProducts(filterProductsArray, cookieOrder, container);
    });

    //Click buy
    $("#buy").on("click", function(){

        const cookieCart = new CookiesClass("cart");
        cookieCart.setCookie(null);
        var validateCartProducts = $("#containerCartProducts .cartProduct").length;

        if(validateCartProducts > 0){

            $("#containerCartProducts").html("Por favor agregar algún producto al carrito.");

            //Count purchase elements
            calculateCartTotalPrice();
            
            alerts("success", "Compra realizada con éxito", "Gracias por comprar con nosotros.", true);
        }else{

            alerts("danger", "Error!", "Debe agregar productos al carrito para realizar una compra.", true);
        }
    });
});