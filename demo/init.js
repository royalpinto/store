'use strict';


const fs = require('fs');
const path = require('path');
const util = require('util');
const mongodb = require('mongodb');
const config = require('./../config');
const models = require('./../models');
const initdata = require('./../initdata');
const UserController = require('./../controllers/user');
const userController = new UserController();

console.log("Using %s env...", config.env);


const copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        let rd = fs.createReadStream(source);
        let wr = fs.createWriteStream(target);
        wr.on("close", ex => {
            if (ex) {
                return reject(ex);
            }
            resolve();
        });
        rd.pipe(wr);
    });
};


const images = {};
const categories = {
    'T Shirts': [
        "Men's Slim fit T-Shirt",
        "Men's cotton T-Shirt",
        "Mid Rise Skinny T-Shirt",
        "Cotton Causual T-Shirt",
        "Casual Cotton T-Shirt",
        "Tri Colour Full Sleeve T-Shirt",
        "Multicolor T-Shirt Set of 5",
    ],
    'Shirts': [
        "Men's Slim fit Shirt",
        "Men's cotton Shirt",
        "Mid Rise Skinny Shirt",
        "Cotton Causual Shirt",
        "Casual Cotton Shirt",
        "Tri Colour Full Sleeve Shirt",
        "Multicolor Shirt Set of 5",
    ],
    'Mobiles': [
        "3G Smart Phone.",
        "Smart Phone 1GB Ram 8 GB Rom",
        "2G Samrt Phone",
        "Black 3G Smart Phone 32GB",
        "Red 2G Smart Phone 16GB",
    ],
    'Watches': [
        "Analog Black Dial Men's Watch",
        "Analog Round Casual Wear Watches for Men",
        "Analog Off-White Dial Women's Watch",
        "Black Dial Men's LED Watch",
        "Aircraft Model Digital Display Wrist Watch",
    ],
    'Footware': [
        "Men's Sandals",
        "Men's Floaters",
        "Men's Mesh Running Shoes",
        "Men's Leather Boat Shoes",
        "Men's Triathlon Running Shoes",
    ],
};
const brandCodes = {
    'Allen Solly': 'ALNSL',
    'Lee': 'LEE',
    'Lee Cooper': 'LCPR',
    'Sony': 'SONY',
    "Samsung": "SMSNG",
    'Fossil': 'FOSSIL',
    "Casio": "CASIO",
    "Fastrack": "FSTRCK",
    "Titan": "TITAN",
    "Pape": "PAPE",
    "RIG": "RIG",
    "Peter England": "PENG",
    "Levis": "LEVIS",
    "Franco Leone": "FLNE",
    "Huawei": "HUWE",
};
const brands = {
    'Allen Solly': ['Shirts', 'T Shirts', 'Footware'],
    'Lee': ['Shirts', 'T Shirts', 'Footware'],
    'Lee Cooper': ['Shirts', 'T Shirts', 'Footware'],
    'Pape': ['Shirts', 'T Shirts'],
    'Sony': ['Mobiles', 'Watches'],
    "Samsung": ["Mobiles", "Watches"],
    'Fossil': ['Watches'],
    'Casio': ['Watches'],
    "Fastrack": ["Watches"],
    "Titan": ["Watches"],
    'Rig': ['T Shirts'],
    'Peter England': ['Shirts', 'T Shirts'],
    'Levis': ['Shirts', 'T Shirts'],
    'Franco Leone': ['Footware'],
    'Huawei': ['Mobiles', 'Watches'],
};


mongodb.MongoClient.connect(config.db.uri)
.then(db => {
    return models.init(db);
})
.then(() => {
    console.log("Removing previous data...");
    return Promise.all([
        models.Cart.collection.removeMany(),
        models.User.collection.removeMany(),
        models.Permission.collection.removeMany(),
        models.Product.collection.removeMany(),
    ]);
})

.then(() => {
    return initdata();
})

.then(() => {
    console.log("Creating admin user, username `admin`: password: `admin`...");
    return userController.create({
        name: "Admin",
        username: "admin",
        email: "admin@store.com",
        password: "admin",
    });
})
.then(user => {
    console.log("Assigning admin user to the admin group...");
    user.member = 'admin';
    return user.save();
})

.then(() => {
    console.log(
        "Creating a user, username: `demouser`, password: `demouser`...");
    return userController.create({
        name: "Demo User",
        username: "demouser",
        email: "demouser@store.com",
        password: "demouser",
    });
})

.then(() => {
    let promises = [];
    for (let category in categories) {
        if (!categories.hasOwnProperty(category)) {
            continue;
        }

        promises
        .push(new Promise((resolve, reject) => {
            fs.readdir(path.join(__dirname, 'img', category), (err, items) => {
                if (err) {
                    reject(err);
                } else {
                    images[category] = items.filter(item => {
                        return item.endsWith('.jpg');
                    });
                    resolve();
                }
            });
        }));
    }
    return Promise.all(promises);
})

.then(() => {
    let promises = [];
    for (let brand in brands) {
        if (!(brands.hasOwnProperty(brand))) {
            continue;
        }
        let code = brandCodes[brand];
        let brandcategories = brands[brand];
        for (let categoryindex in brandcategories) {
            if (!(brandcategories.hasOwnProperty(categoryindex))) {
                continue;
            }
            let category = brandcategories[categoryindex];
            let items = categories[category];
            ((items, brand, code, category, ci, promises) => {
                items.forEach((item, index) => {
                    let name = util.format("%s - %s0%d%d",
                        item, code, ci, index + 1);

                    let imageindex = Math
                        .floor(Math.random() * images[category].length - 1) + 1;
                    let dest = path.join("img/products",
                        images[category][imageindex]);
                    let product = new models.Product({
                        code: util.format("%s0%d%d", code, ci, index + 1),
                        name: name,
                        brand: brand,
                        category: category,
                        price: Math.floor(Math.random() * 100) + 1,
                        quantity: Math.floor(Math.random() * 100) + 1,
                        description: util.format("%s %s", code, name),
                        imgsrc: 'img/products/' + images[category][imageindex],
                        features: [
                            'Slim Fit',
                            'Strechable',
                            'Rough use',
                        ],
                    });
                    let src = path.join(
                        'demo/img/',
                        category,
                        images[category][imageindex]
                    );
                    dest = path.join('public', dest);
                    promises.push(copyFile(src, dest));
                    promises.push(product.save());
                });
            })(items, brand, code, category, categoryindex, promises);
        }
    }

    return Promise.all(promises);
})

.then(() => {
    models.db.close();
    console.log("Demo data is ready.");
})
.catch(error => {
    console.log("\nError!!!");
    console.error(error);
    console.error(error.stack);
})
;
