var util = require('util');
var mongodb = require('mongodb');
var config = require('./../config');
var models = require('./../models');
var initdata = require('./../initdata');
var authController = require('./../controllers/auth');

console.log("Using %s env...", config.env);


mongodb.MongoClient.connect(config.db.uri)
.then(function(db) {
    return models.init(db);
})
.then(function() {
    console.log("Removing previous data...");
    return Promise.all([
        models.User.collection.removeMany(),
        models.Permission.collection.removeMany(),
        models.Product.collection.removeMany(),
    ]);
})

.then(function() {
    return initdata();
})

.then(function() {
    console.log("Creating admin user, username `admin`: password: `admin`...");
    return authController.registerUser({
        name: "Admin",
        username: "admin",
        email: "admin@store.com",
        password: "admin",
    });
})
.then(function(user) {
    console.log("Assigning admin user to the admin group...");
    user.member = 'admin';
    return user.save();
})

.then(function() {
    console.log(
        "Creating a user, username: `demouser`, password: `demouser`...");
    return authController.registerUser({
        name: "Demo User",
        username: "demouser",
        email: "demouser@store.com",
        password: "demouser",
    });
})

.then(function() {
    console.log();
    var categories = {
        Clothing: [
            "Men's Slim fit Shirt",
            "Men's cotton shirt",
            "Cotton Lounge Pant",
            "Women's Top",
            "Mid Rise Skinny Jeans",
            "Shirt Navy Blue Solid",
            "Cotton Formal Shirt",
            "Casual Cotton Shirt",
            "Tri Colour Full Sleeve T-Shirt",
            "Multicolor T-Shirt Set of 5",
        ],
        Books: [
            "Algorithms in a Nutshell",
            "Algorithms In A Nutshell 2nd Edition",
            "Learning Data Structures and Algorithms",
            "Data Structures and Algorithms with JavaScript",
            "Head First Design Patterns",
        ],
        Mobiles: ["3G Smart Phone.", "Smart Phone 1GB Ram 8 GB Rom"],
        Watches: [
            "Analog Black Dial Men's Watch",
            "Analog Round Casual Wear Watches for Men",
            "Analog Off-White Dial Women's Watch",
            "Black Dial Men's LED Watch",
            "Aircraft Model Digital Display Wrist Watch",
        ],
        Footware: [
            "Men's Sandals",
            "Men's Floaters",
            "Men's Mesh Running Shoes",
            "Men's Leather Boat Shoes",
            "Women's Triathlon Running Shoes",
        ],
    };
    var brandCodes = {
        'Allen Solly': 'ALNSL',
        'Lee': 'LEE',
        'Lee Cooper': 'LCPR',
        'Sony': 'SONY',
        "O'Really": 'OREALLY',
        'Fossil': 'FOSSIL',
        "Casio": "CASIO",
        "Fastrack": "FSTRCK",
    };
    var brands = {
        'Allen Solly': ['Clothing', 'Footware'],
        'Lee': ['Clothing', 'Footware'],
        'Lee Cooper': ['Clothing', 'Footware'],
        'Sony': ['Mobiles'],
        "O'Really": ['Books'],
        'Fossil': ['Watches'],
        'Casio': ['Watches'],
        "Fastrack": ["Watches"],
    };
    var promises = [];
    for (var brand in brands) {
        if (!(brands.hasOwnProperty(brand))) {
            continue;
        }
        var code = brandCodes[brand];
        var brandcategories = brands[brand];
        for (var categoryindex in brandcategories) {
            if (!(brandcategories.hasOwnProperty(categoryindex))) {
                continue;
            }
            var category = brandcategories[categoryindex];
            var items = categories[category];
            (function(items, brand, code, category, ci, promises) {
                items.forEach(function(item, index) {
                    var name = util.format("%s %s - %s0%d%d", brand,
                        item, code, ci, index + 1);
                    console.log(name);
                    var product = new models.Product({
                        code: util.format("%s0%d%d", code, ci, index + 1),
                        name: name,
                        brand: brand,
                        category: category,
                        price: Math.floor(Math.random() * 100) + 1,
                        quantity: Math.floor(Math.random() * 100) + 1,
                    });
                    promises.push(product.save());
                });
            })(items, brand, code, category, categoryindex, promises);
        }
    }
    console.log();

    return Promise.all(promises);
})

.then(function() {
    models.db.close();
    console.log("Demo data is ready.");
})
.catch(function(error) {
    console.log("\nError!!!");
    console.error(error);
    console.error(error.stack);
})
;
