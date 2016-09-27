## Objects

<dl>
<dt><a href="#models">models</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#controllers">controllers</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#app">app</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#errors">errors</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#handle">handle(req, res, error)</a> ⇒ <code>null</code></dt>
<dd><p>A error handler middlware: checks if error is thrown from the App or from an
internal library, then returns a customized error message to the client with
an appropriate status.</p>
</dd>
</dl>

<a name="models"></a>

## models : <code>object</code>
**Kind**: global namespace  

* [models](#models) : <code>object</code>
    * [.Cart](#models.Cart) ⇐ <code>[Model](#models.Model)</code>
        * [new Cart([properties])](#new_models.Cart_new)
        * [.getProducts()](#models.Cart+getProducts) ⇒ <code>Promise</code>
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
        * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
    * [.CartItem](#models.CartItem) ⇐ <code>[Model](#models.Model)</code>
        * [new CartItem([properties])](#new_models.CartItem_new)
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
        * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
    * [.Model](#models.Model)
        * [new Model([properties])](#new_models.Model_new)
        * _instance_
            * [.save()](#models.Model+save) ⇒ <code>Promise</code>
            * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
            * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
            * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
            * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
            * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
        * _static_
            * [.setSchema(schema, fieldname, config)](#models.Model.setSchema)
            * [.init(db)](#models.Model.init) ⇒ <code>Promise</code>
            * [.findById(_id)](#models.Model.findById) ⇒ <code>Promise</code>
            * [.findByKey(key, value)](#models.Model.findByKey) ⇒ <code>Promise</code>
            * [.findOne(query)](#models.Model.findOne) ⇒ <code>Promise</code>
            * [.findAndCount(query, limit, skip, order)](#models.Model.findAndCount) ⇒ <code>Promise</code>
            * [.validateFiled(key, value)](#models.Model.validateFiled) ⇒ <code>Promise</code>
    * [.Permission](#models.Permission) ⇐ <code>[Model](#models.Model)</code>
        * [new Permission([properties])](#new_models.Permission_new)
        * _instance_
            * [.save()](#models.Model+save) ⇒ <code>Promise</code>
            * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
            * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
            * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
            * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
            * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
        * _static_
            * [.add(group, noun, verb)](#models.Permission.add) ⇒ <code>Promise</code>
            * [.remove(group, noun, verb)](#models.Permission.remove) ⇒ <code>Promise</code>
            * [.check(group, noun, verb)](#models.Permission.check) ⇒ <code>Promise</code>
    * [.Product](#models.Product) ⇐ <code>[Model](#models.Model)</code>
        * [new Product([properties])](#new_models.Product_new)
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
        * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
    * [.User](#models.User) ⇐ <code>[Model](#models.Model)</code>
        * [new User([properties])](#new_models.User_new)
        * [.hasPermission(noun, verb)](#models.User+hasPermission) ⇒ <code>Promise</code>
        * [.toJSON()](#models.User+toJSON) ⇒ <code>Object</code>
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
    * [.validators](#models.validators) : <code>object</code>
        * [.objectID(required)](#models.validators.objectID) ⇒ <code>function</code>
        * [.email(required)](#models.validators.email) ⇒ <code>function</code>
        * [.string([min], [max])](#models.validators.string) ⇒ <code>function</code>
        * [.number([min], [max])](#models.validators.number) ⇒ <code>function</code>
    * [.init(db)](#models.init) ⇒ <code>Promise</code>
    * [.getDB()](#models.getDB) ⇒ <code>Promise</code>

<a name="models.Cart"></a>

### models.Cart ⇐ <code>[Model](#models.Model)</code>
Instances of the Cart class represent a single user cart document.

**Kind**: static class of <code>[models](#models)</code>  
**Extends:** <code>[Model](#models.Model)</code>  

* [.Cart](#models.Cart) ⇐ <code>[Model](#models.Model)</code>
    * [new Cart([properties])](#new_models.Cart_new)
    * [.getProducts()](#models.Cart+getProducts) ⇒ <code>Promise</code>
    * [.save()](#models.Model+save) ⇒ <code>Promise</code>
    * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
    * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
    * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
    * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
    * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>

<a name="new_models.Cart_new"></a>

#### new Cart([properties])
Initialize a cart with given properties.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set to the cart. |
| [properties.userId] | <code>String/ObjectId</code> |  | The unique user id. |
| [properties.items] | <code>Array</code> |  | An array of CartItem instances. |

<a name="models.Cart+getProducts"></a>

#### cart.getProducts() ⇒ <code>Promise</code>
Fetch products from the cart items.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with list of `Product`s upon success
and rejects with an error upon failure.  
<a name="models.Model+save"></a>

#### cart.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### cart.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### cart.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### cart.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### cart.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model+toJSON"></a>

#### cart.toJSON() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.
This method will be invoked by the serializers like JSON.stringify etc.

**Kind**: instance method of <code>[Cart](#models.Cart)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.CartItem"></a>

### models.CartItem ⇐ <code>[Model](#models.Model)</code>
Instances of the CartItem class represent a single cart item.
This should be used as a sub document of Cart class and not as a main document.

**Kind**: static class of <code>[models](#models)</code>  
**Extends:** <code>[Model](#models.Model)</code>  

* [.CartItem](#models.CartItem) ⇐ <code>[Model](#models.Model)</code>
    * [new CartItem([properties])](#new_models.CartItem_new)
    * [.save()](#models.Model+save) ⇒ <code>Promise</code>
    * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
    * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
    * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
    * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
    * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>

<a name="new_models.CartItem_new"></a>

#### new CartItem([properties])
Initialize a single cart item.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set to the cartitem. |
| [properties.productId] | <code>String/ObjectID</code> |  | The product id. |
| [properties.quantity] | <code>Number</code> |  | The product quantity. |

<a name="models.Model+save"></a>

#### cartItem.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### cartItem.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### cartItem.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### cartItem.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### cartItem.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model+toJSON"></a>

#### cartItem.toJSON() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.
This method will be invoked by the serializers like JSON.stringify etc.

**Kind**: instance method of <code>[CartItem](#models.CartItem)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model"></a>

### models.Model
Instances of the Model class represent a single database document.

**Kind**: static class of <code>[models](#models)</code>  

* [.Model](#models.Model)
    * [new Model([properties])](#new_models.Model_new)
    * _instance_
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
        * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.setSchema(schema, fieldname, config)](#models.Model.setSchema)
        * [.init(db)](#models.Model.init) ⇒ <code>Promise</code>
        * [.findById(_id)](#models.Model.findById) ⇒ <code>Promise</code>
        * [.findByKey(key, value)](#models.Model.findByKey) ⇒ <code>Promise</code>
        * [.findOne(query)](#models.Model.findOne) ⇒ <code>Promise</code>
        * [.findAndCount(query, limit, skip, order)](#models.Model.findAndCount) ⇒ <code>Promise</code>
        * [.validateFiled(key, value)](#models.Model.validateFiled) ⇒ <code>Promise</code>

<a name="new_models.Model_new"></a>

#### new Model([properties])
Initialize a model with given properties.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set to the model. |

<a name="models.Model+save"></a>

#### model.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### model.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### model.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### model.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### model.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model+toJSON"></a>

#### model.toJSON() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.
This method will be invoked by the serializers like JSON.stringify etc.

**Kind**: instance method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model.setSchema"></a>

#### Model.setSchema(schema, fieldname, config)
Set schema to be used for the Model.

**Kind**: static method of <code>[Model](#models.Model)</code>  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Schema.&lt;fieldname, config&gt;</code> | The schema to used for the Model. |
| fieldname | <code>String</code> | The fieldname. |
| config | <code>Object</code> | The configuration for the schema field. |
| config.type | <code>function</code> | The type of the schema field. |
| config.unique | <code>Boolean</code> | A flag to consider field to be unique. |
| config.validations | <code>Array</code> | An array of validators. Every validator object should have fn property (a function which recieves fieldname and value as input and returns `Promise` which resolves with an optional casted value if validation is success, otherwise rejects with an error message.) |

<a name="models.Model.init"></a>

#### Model.init(db) ⇒ <code>Promise</code>
Init model with given db instance, set indexes and references.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| db | <code>Object</code> | The mongodb database instance. |

<a name="models.Model.findById"></a>

#### Model.findById(_id) ⇒ <code>Promise</code>
Find model by the given id.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that returns a model or null if resolved,
or an Error if rejected.  

| Param | Type | Description |
| --- | --- | --- |
| _id | <code>ObjectID/String</code> | _id of the model. |

<a name="models.Model.findByKey"></a>

#### Model.findByKey(key, value) ⇒ <code>Promise</code>
Find a model by the given key and value.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that returns a model or null if resolved,
or an Error if rejected.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key. |
| value | <code>Object</code> | The value. |

<a name="models.Model.findOne"></a>

#### Model.findOne(query) ⇒ <code>Promise</code>
Find a model by the given query.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that returns a model or null if resolved,
or an Error if rejected.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |

<a name="models.Model.findAndCount"></a>

#### Model.findAndCount(query, limit, skip, order) ⇒ <code>Promise</code>
Find models and total count(without limit/skip) for the given query, limit,
skip and order.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that returns models and count if resolved,
or an Error if rejected.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  models to be fetched. |
| skip | <code>Number</code> | Skip number of models to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. This will be applied before applying the limit/skip parameters. |

<a name="models.Model.validateFiled"></a>

#### Model.validateFiled(key, value) ⇒ <code>Promise</code>
Validate a given field specified by a key and value.

**Kind**: static method of <code>[Model](#models.Model)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if field passes through all the
validations, otherwise rejects with a `ValidationError`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key. |
| value | <code>Object</code> | The value. |

<a name="models.Permission"></a>

### models.Permission ⇐ <code>[Model](#models.Model)</code>
Instances of the Permission class represent a single permission
document.

**Kind**: static class of <code>[models](#models)</code>  
**Extends:** <code>[Model](#models.Model)</code>  

* [.Permission](#models.Permission) ⇐ <code>[Model](#models.Model)</code>
    * [new Permission([properties])](#new_models.Permission_new)
    * _instance_
        * [.save()](#models.Model+save) ⇒ <code>Promise</code>
        * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
        * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
        * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
        * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
        * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.add(group, noun, verb)](#models.Permission.add) ⇒ <code>Promise</code>
        * [.remove(group, noun, verb)](#models.Permission.remove) ⇒ <code>Promise</code>
        * [.check(group, noun, verb)](#models.Permission.check) ⇒ <code>Promise</code>

<a name="new_models.Permission_new"></a>

#### new Permission([properties])
Initialize a permission model with given properties.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set. |
| [properties.group] | <code>String</code> |  | The group name. |
| [properties.noun] | <code>String</code> |  | A noun. |
| [properties.verb] | <code>String</code> |  | A verb. |

<a name="models.Model+save"></a>

#### permission.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### permission.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### permission.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### permission.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### permission.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model+toJSON"></a>

#### permission.toJSON() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.
This method will be invoked by the serializers like JSON.stringify etc.

**Kind**: instance method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Permission.add"></a>

#### Permission.add(group, noun, verb) ⇒ <code>Promise</code>
Add/Set permission.

**Kind**: static method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon success and rejects with an
error upon failure.  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>String</code> | A group. |
| noun | <code>String</code> | A noun. |
| verb | <code>String</code> | A verb. |

<a name="models.Permission.remove"></a>

#### Permission.remove(group, noun, verb) ⇒ <code>Promise</code>
Remove/Unset permission.

**Kind**: static method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon success and rejects with an
error upon failure.  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>String</code> | A group. |
| noun | <code>String</code> | A noun. |
| verb | <code>String</code> | A verb. |

<a name="models.Permission.check"></a>

#### Permission.check(group, noun, verb) ⇒ <code>Promise</code>
Check permission.

**Kind**: static method of <code>[Permission](#models.Permission)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon success and rejects with an
error upon failure.  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>String</code> | A group. |
| noun | <code>String</code> | A noun. |
| verb | <code>String</code> | A verb. |

<a name="models.Product"></a>

### models.Product ⇐ <code>[Model](#models.Model)</code>
Instances of the Product class represent a single product db document.

**Kind**: static class of <code>[models](#models)</code>  
**Extends:** <code>[Model](#models.Model)</code>  

* [.Product](#models.Product) ⇐ <code>[Model](#models.Model)</code>
    * [new Product([properties])](#new_models.Product_new)
    * [.save()](#models.Model+save) ⇒ <code>Promise</code>
    * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
    * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
    * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
    * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>
    * [.toJSON()](#models.Model+toJSON) ⇒ <code>Object</code>

<a name="new_models.Product_new"></a>

#### new Product([properties])
Initialize a product with given properties.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set to the product. |
| [properties.name] | <code>String</code> |  | Name of the product. |
| [properties.code] | <code>String</code> |  | The unique product code. |
| [properties.price] | <code>Number</code> |  | The product price. |
| [properties.quantity] | <code>Number</code> |  | The product quantity. |
| [properties.category] | <code>String</code> |  | The product category. |
| [properties.brand] | <code>String</code> |  | The product brand. |
| [properties.description] | <code>String</code> |  | The product description. |
| [properties.features] | <code>Array</code> |  | The list of features. |
| [properties.imgsrc] | <code>String</code> |  | The imgsrc of the product. |

<a name="models.Model+save"></a>

#### product.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### product.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### product.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### product.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### product.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.Model+toJSON"></a>

#### product.toJSON() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.
This method will be invoked by the serializers like JSON.stringify etc.

**Kind**: instance method of <code>[Product](#models.Product)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.User"></a>

### models.User ⇐ <code>[Model](#models.Model)</code>
Instances of the User class represent a single user db document.

**Kind**: static class of <code>[models](#models)</code>  
**Extends:** <code>[Model](#models.Model)</code>  

* [.User](#models.User) ⇐ <code>[Model](#models.Model)</code>
    * [new User([properties])](#new_models.User_new)
    * [.hasPermission(noun, verb)](#models.User+hasPermission) ⇒ <code>Promise</code>
    * [.toJSON()](#models.User+toJSON) ⇒ <code>Object</code>
    * [.save()](#models.Model+save) ⇒ <code>Promise</code>
    * [.update(properties)](#models.Model+update) ⇒ <code>Promise</code>
    * [.remove()](#models.Model+remove) ⇒ <code>Promise</code>
    * [.validate()](#models.Model+validate) ⇒ <code>Promise</code>
    * [.toObject()](#models.Model+toObject) ⇒ <code>Object</code>

<a name="new_models.User_new"></a>

#### new User([properties])
Initialize a user with given properties.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [properties] | <code>Object</code> | <code>{}</code> | The properties to be set to the user. |
| [properties.name] | <code>String</code> |  | Name of the user. |
| [properties.email] | <code>String</code> |  | Email Id of the user. |
| [properties.username] | <code>String</code> |  | The unique username. |
| [properties.group] | <code>String</code> |  | The group for which user belongs to. |
| [properties.hash] | <code>String</code> |  | Hash generated from the password. |
| [properties.salt] | <code>String</code> |  | Salt used to generate the hash. |

<a name="models.User+hasPermission"></a>

#### user.hasPermission(noun, verb) ⇒ <code>Promise</code>
Check if user permission for the verb(task) on a given noun(module).

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with a flag indicating the
permission.  

| Param | Type | Description |
| --- | --- | --- |
| noun | <code>String</code> | The noun or module on which permission to be checked. |
| verb | <code>String</code> | The verb or task. |

<a name="models.User+toJSON"></a>

#### user.toJSON() ⇒ <code>Object</code>
Convert user object to a plain JavaScript object. This is overriden method to
skip password specific properties.

**Kind**: instance method of <code>[User](#models.User)</code>  
**Overrides:** <code>[toJSON](#models.Model+toJSON)</code>  
**Returns**: <code>Object</code> - A converted plain JavaScript Object.  
<a name="models.Model+save"></a>

#### user.save() ⇒ <code>Promise</code>
Save model (If model._id is not set, create a new model otherwise update existing)

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+update"></a>

#### user.update(properties) ⇒ <code>Promise</code>
Update model with given fields.

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Obejct</code> | The properties (according to the schema) to be updated. |

<a name="models.Model+remove"></a>

#### user.remove() ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if everything goes good.  
<a name="models.Model+validate"></a>

#### user.validate() ⇒ <code>Promise</code>
Validate model.

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Promise</code> - A promise that resolves if model passes through all the
validations, otherwise rejects with a `ValidationError`.  
<a name="models.Model+toObject"></a>

#### user.toObject() ⇒ <code>Object</code>
Convert Model class instance to a plain JavaScript Object.

**Kind**: instance method of <code>[User](#models.User)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="models.validators"></a>

### models.validators : <code>object</code>
**Kind**: static namespace of <code>[models](#models)</code>  

* [.validators](#models.validators) : <code>object</code>
    * [.objectID(required)](#models.validators.objectID) ⇒ <code>function</code>
    * [.email(required)](#models.validators.email) ⇒ <code>function</code>
    * [.string([min], [max])](#models.validators.string) ⇒ <code>function</code>
    * [.number([min], [max])](#models.validators.number) ⇒ <code>function</code>

<a name="models.validators.objectID"></a>

#### validators.objectID(required) ⇒ <code>function</code>
A validator to check if given value is a valid `ObjectID`.

**Kind**: static method of <code>[validators](#models.validators)</code>  
**Returns**: <code>function</code> - A validator function which returns a `Promise`
(which resolves with a casted value if validation passes through,
otherwise rejects with a ValidationError).  

| Param | Type | Description |
| --- | --- | --- |
| required | <code>Boolean</code> | A flag to set if value is required. |

<a name="models.validators.email"></a>

#### validators.email(required) ⇒ <code>function</code>
A validator to check if given value is a valid email.

**Kind**: static method of <code>[validators](#models.validators)</code>  
**Returns**: <code>function</code> - A validator function which returns a `Promise`
(which resolves with a casted value if validation passes through,
otherwise rejects with a ValidationError).  

| Param | Type | Description |
| --- | --- | --- |
| required | <code>Boolean</code> | A flag to set if value is required. |

<a name="models.validators.string"></a>

#### validators.string([min], [max]) ⇒ <code>function</code>
A validator to check if given value is a valid string.

**Kind**: static method of <code>[validators](#models.validators)</code>  
**Returns**: <code>function</code> - A validator function which returns a `Promise`
(which resolves with a casted value if validation passes through,
otherwise rejects with a ValidationError).  

| Param | Type | Description |
| --- | --- | --- |
| [min] | <code>Number</code> | String should not be lesser than given min value. |
| [max] | <code>Number</code> | String should not be greater than given max value. |

<a name="models.validators.number"></a>

#### validators.number([min], [max]) ⇒ <code>function</code>
A validator to check if given value is a valid number.

**Kind**: static method of <code>[validators](#models.validators)</code>  
**Returns**: <code>function</code> - A validator function which returns a `Promise`
(which resolves with a casted value if validation passes through,
otherwise rejects with a ValidationError).  

| Param | Type | Description |
| --- | --- | --- |
| [min] | <code>Number</code> | Value should not be lesser than min value. |
| [max] | <code>Number</code> | Value should not be greater than max value. |

<a name="models.init"></a>

### models.init(db) ⇒ <code>Promise</code>
Initialize the models.
This has to be called before making queries using model classes.

**Kind**: static method of <code>[models](#models)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon initialization and rejects
upon failure.  

| Param | Type | Description |
| --- | --- | --- |
| db | <code>Object</code> | The mongodb database connection instance. |

<a name="models.getDB"></a>

### models.getDB() ⇒ <code>Promise</code>
Get the db connection instance.
This is usefull for modules which requires db promises.

**Kind**: static method of <code>[models](#models)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with db connection instance
(Promise will be resolved only after models.init is invoked).  
<a name="controllers"></a>

## controllers : <code>object</code>
**Kind**: global namespace  

* [controllers](#controllers) : <code>object</code>
    * [.Controller](#controllers.Controller)
        * [new Controller(Model)](#new_controllers.Controller_new)
        * [.create(data)](#controllers.Controller+create) ⇒ <code>Promise</code>
        * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
        * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
        * [.update(id, data)](#controllers.Controller+update) ⇒ <code>Promise</code>
        * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>
    * [.ProductController](#controllers.ProductController) ⇐ <code>[Controller](#controllers.Controller)</code>
        * [new ProductController()](#new_controllers.ProductController_new)
        * [.create(data)](#controllers.ProductController+create) ⇒ <code>Promise</code>
        * [.update(id, data)](#controllers.ProductController+update) ⇒ <code>Promise</code>
        * [.getCategories(query, limit, skip, order)](#controllers.ProductController+getCategories) ⇒ <code>Promise</code>
        * [.getBrands(query, limit, skip, order)](#controllers.ProductController+getBrands) ⇒ <code>Promise</code>
        * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
        * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
        * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>
    * [.UserController](#controllers.UserController) ⇐ <code>[Controller](#controllers.Controller)</code>
        * [new UserController()](#new_controllers.UserController_new)
        * [.create(data)](#controllers.UserController+create) ⇒ <code>Promise</code>
        * [.update(id, data)](#controllers.UserController+update) ⇒ <code>Promise</code>
        * [.login(username, password)](#controllers.UserController+login) ⇒ <code>Promise</code>
        * [.hasPermission(userid, noun, verb)](#controllers.UserController+hasPermission) ⇒ <code>Promise</code>
        * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
        * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
        * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>

<a name="controllers.Controller"></a>

### controllers.Controller
A base controller class with very high level common methods.

**Kind**: static class of <code>[controllers](#controllers)</code>  

* [.Controller](#controllers.Controller)
    * [new Controller(Model)](#new_controllers.Controller_new)
    * [.create(data)](#controllers.Controller+create) ⇒ <code>Promise</code>
    * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
    * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
    * [.update(id, data)](#controllers.Controller+update) ⇒ <code>Promise</code>
    * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>

<a name="new_controllers.Controller_new"></a>

#### new Controller(Model)
Initialize a controller.


| Param | Type | Description |
| --- | --- | --- |
| Model | <code>[Model](#models.Model)</code> | The model on which controller should act. |

<a name="controllers.Controller+create"></a>

#### controller.create(data) ⇒ <code>Promise</code>
Create a model from the given data.

**Kind**: instance method of <code>[Controller](#controllers.Controller)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon model creation and rejects upon failure.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be set to the model. |

<a name="controllers.Controller+getById"></a>

#### controller.getById(id) ⇒ <code>Promise</code>
Fetch a model for the given id.

**Kind**: instance method of <code>[Controller](#controllers.Controller)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived model.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="controllers.Controller+get"></a>

#### controller.get(query, limit, skip, order) ⇒ <code>Promise</code>
Fetch models for the given input.

**Kind**: instance method of <code>[Controller](#controllers.Controller)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived models and count.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  models to be fetched. |
| skip | <code>Number</code> | Skip number of models to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. |

<a name="controllers.Controller+update"></a>

#### controller.update(id, data) ⇒ <code>Promise</code>
Update a model.

**Kind**: instance method of <code>[Controller](#controllers.Controller)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |
| data | <code>Object</code> | The data to be updated. |

<a name="controllers.Controller+remove"></a>

#### controller.remove(id) ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[Controller](#controllers.Controller)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="controllers.ProductController"></a>

### controllers.ProductController ⇐ <code>[Controller](#controllers.Controller)</code>
A product controller with methods to manage products.

**Kind**: static class of <code>[controllers](#controllers)</code>  
**Extends:** <code>[Controller](#controllers.Controller)</code>  

* [.ProductController](#controllers.ProductController) ⇐ <code>[Controller](#controllers.Controller)</code>
    * [new ProductController()](#new_controllers.ProductController_new)
    * [.create(data)](#controllers.ProductController+create) ⇒ <code>Promise</code>
    * [.update(id, data)](#controllers.ProductController+update) ⇒ <code>Promise</code>
    * [.getCategories(query, limit, skip, order)](#controllers.ProductController+getCategories) ⇒ <code>Promise</code>
    * [.getBrands(query, limit, skip, order)](#controllers.ProductController+getBrands) ⇒ <code>Promise</code>
    * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
    * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
    * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>

<a name="new_controllers.ProductController_new"></a>

#### new ProductController()
Initialize a product controller.

<a name="controllers.ProductController+create"></a>

#### productController.create(data) ⇒ <code>Promise</code>
Create a product from the given data.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Overrides:** <code>[create](#controllers.Controller+create)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon creation.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be set to the product. |

<a name="controllers.ProductController+update"></a>

#### productController.update(id, data) ⇒ <code>Promise</code>
Update a product with given data.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Overrides:** <code>[update](#controllers.Controller+update)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |
| data | <code>Object</code> | The data to be updated. |

<a name="controllers.ProductController+getCategories"></a>

#### productController.getCategories(query, limit, skip, order) ⇒ <code>Promise</code>
Fetch categories for the given query.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with categories and count upon
completion.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  categories to be fetched. |
| skip | <code>Number</code> | Skip number of categories to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. |

<a name="controllers.ProductController+getBrands"></a>

#### productController.getBrands(query, limit, skip, order) ⇒ <code>Promise</code>
Fetch brands for the given query.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with brands and count upon
completion.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  brands to be fetched. |
| skip | <code>Number</code> | Skip number of brands to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. |

<a name="controllers.Controller+getById"></a>

#### productController.getById(id) ⇒ <code>Promise</code>
Fetch a model for the given id.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived model.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="controllers.Controller+get"></a>

#### productController.get(query, limit, skip, order) ⇒ <code>Promise</code>
Fetch models for the given input.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived models and count.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  models to be fetched. |
| skip | <code>Number</code> | Skip number of models to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. |

<a name="controllers.Controller+remove"></a>

#### productController.remove(id) ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[ProductController](#controllers.ProductController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="controllers.UserController"></a>

### controllers.UserController ⇐ <code>[Controller](#controllers.Controller)</code>
A user controller with methods to manage users.

**Kind**: static class of <code>[controllers](#controllers)</code>  
**Extends:** <code>[Controller](#controllers.Controller)</code>  

* [.UserController](#controllers.UserController) ⇐ <code>[Controller](#controllers.Controller)</code>
    * [new UserController()](#new_controllers.UserController_new)
    * [.create(data)](#controllers.UserController+create) ⇒ <code>Promise</code>
    * [.update(id, data)](#controllers.UserController+update) ⇒ <code>Promise</code>
    * [.login(username, password)](#controllers.UserController+login) ⇒ <code>Promise</code>
    * [.hasPermission(userid, noun, verb)](#controllers.UserController+hasPermission) ⇒ <code>Promise</code>
    * [.getById(id)](#controllers.Controller+getById) ⇒ <code>Promise</code>
    * [.get(query, limit, skip, order)](#controllers.Controller+get) ⇒ <code>Promise</code>
    * [.remove(id)](#controllers.Controller+remove) ⇒ <code>Promise</code>

<a name="new_controllers.UserController_new"></a>

#### new UserController()
Initialize a user controller.

<a name="controllers.UserController+create"></a>

#### userController.create(data) ⇒ <code>Promise</code>
Create a user from the given data.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Overrides:** <code>[create](#controllers.Controller+create)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon creation.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be set to the user. |

<a name="controllers.UserController+update"></a>

#### userController.update(id, data) ⇒ <code>Promise</code>
Update a user with given data.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Overrides:** <code>[update](#controllers.Controller+update)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |
| data | <code>Object</code> | The data to be updated. |

<a name="controllers.UserController+login"></a>

#### userController.login(username, password) ⇒ <code>Promise</code>
Login/Validate username password.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with user model upon successful
login, otherwsie rejects with an error. NOTE: This does not handle sessions.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> | The username. |
| password | <code>String</code> | The password. |

<a name="controllers.UserController+hasPermission"></a>

#### userController.hasPermission(userid, noun, verb) ⇒ <code>Promise</code>
Check if user has permission for the verb(task) on a given noun(module).

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with a flag indicating the
permission.  

| Param | Type | Description |
| --- | --- | --- |
| userid | <code>String</code> | The user id for which permission to be checked. |
| noun | <code>String</code> | The noun or module on which permission to be checked. |
| verb | <code>String</code> | The verb or task. |

<a name="controllers.Controller+getById"></a>

#### userController.getById(id) ⇒ <code>Promise</code>
Fetch a model for the given id.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived model.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="controllers.Controller+get"></a>

#### userController.get(query, limit, skip, order) ⇒ <code>Promise</code>
Fetch models for the given input.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves with the retrived models and count.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Query</code> | Query according to the mongodb native nodejs driver spec. |
| limit | <code>Number</code> | Limit by number of  models to be fetched. |
| skip | <code>Number</code> | Skip number of models to be fetched. |
| order | <code>Order</code> | Order according to the mongodb native nodejs driver spec. |

<a name="controllers.Controller+remove"></a>

#### userController.remove(id) ⇒ <code>Promise</code>
Remove a model.

**Kind**: instance method of <code>[UserController](#controllers.UserController)</code>  
**Returns**: <code>Promise</code> - A promise which resolves upon completion.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String/ObjectID</code> | The model id. |

<a name="app"></a>

## app : <code>object</code>
**Kind**: global namespace  

* [app](#app) : <code>object</code>
    * [.Router](#app.Router)
        * [new Router()](#new_app.Router_new)
        * [.use([_regex], _cb)](#app.Router+use)
        * [.post(regex, cb)](#app.Router+post)
        * [.get(regex, cb)](#app.Router+get)
        * [.put(regex, cb)](#app.Router+put)
        * [.delete(regex, cb)](#app.Router+delete)
        * [.dispatch(req, res, next)](#app.Router+dispatch)

<a name="app.Router"></a>

### app.Router
A router class to route requests base on the url pattern
and request methods.

**Kind**: static class of <code>[app](#app)</code>  

* [.Router](#app.Router)
    * [new Router()](#new_app.Router_new)
    * [.use([_regex], _cb)](#app.Router+use)
    * [.post(regex, cb)](#app.Router+post)
    * [.get(regex, cb)](#app.Router+get)
    * [.put(regex, cb)](#app.Router+put)
    * [.delete(regex, cb)](#app.Router+delete)
    * [.dispatch(req, res, next)](#app.Router+dispatch)

<a name="new_app.Router_new"></a>

#### new Router()
Initialize a router.

<a name="app.Router+use"></a>

#### router.use([_regex], _cb)
Add a function to be used (for all request methods) for all requests or for
a request with specific url pattern.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [_regex] | <code>RegExp</code> | A optional regex pattern to be matched with request url. |
| _cb | <code>function</code> | A function or router to be invoked upon request. This function will be invoked upon request with req, res and next parameter by the dispatcher. Based on the scenarios, function has to either return a response or has to invoke next callback. |

<a name="app.Router+post"></a>

#### router.post(regex, cb)
Add a function to be used only for POST request with specific url pattern.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>RegExp</code> | A regex pattern to be matched with request url. |
| cb | <code>function</code> | A function or router to be invoked upon request. This function will be invoked upon request with req, res and next parameter by the dispatcher. Based on the scenarios, function has to either return a response or has to invoke next callback. |

<a name="app.Router+get"></a>

#### router.get(regex, cb)
Add a function to be used only for GET request with specific url pattern.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>RegExp</code> | A regex pattern to be matched with request url. |
| cb | <code>function</code> | A function or router to be invoked upon request. |

<a name="app.Router+put"></a>

#### router.put(regex, cb)
Add a function to be used only for PUT request with specific url pattern.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>RegExp</code> | A regex pattern to be matched with request url. |
| cb | <code>function</code> | A function or router to be invoked upon request. |

<a name="app.Router+delete"></a>

#### router.delete(regex, cb)
Add a function to be used only for DELETE request with specific url pattern.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>RegExp</code> | A regex pattern to be matched with request url. |
| cb | <code>function</code> | A function or router to be invoked upon request. |

<a name="app.Router+dispatch"></a>

#### router.dispatch(req, res, next)
Dispatch request to routes configured.
Function from routes will be fetched (the order in which they have been added)
and executed. If function invokes next callback given, dispatcher will
continue with the next set of routes.

**Kind**: instance method of <code>[Router](#app.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | A http(s) request object. |
| res | <code>Response</code> | A http(s) response object. |
| next | <code>function</code> | A function to be invoked if none of the routes are returning response. |

<a name="errors"></a>

## errors : <code>object</code>
**Kind**: global namespace  

* [errors](#errors) : <code>object</code>
    * [.AppError](#errors.AppError)
        * [new AppError(message, error)](#new_errors.AppError_new)
        * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>
    * [.ValidationError](#errors.ValidationError) ⇐ <code>[AppError](#errors.AppError)</code>
        * [new ValidationError(error)](#new_errors.ValidationError_new)
        * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>
    * [.UnauthorizedAccess](#errors.UnauthorizedAccess) ⇐ <code>[AppError](#errors.AppError)</code>
        * [new UnauthorizedAccess(error)](#new_errors.UnauthorizedAccess_new)
        * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>
    * [.UnauthenticatedAccess](#errors.UnauthenticatedAccess) ⇐ <code>[AppError](#errors.AppError)</code>
        * [new UnauthenticatedAccess(error)](#new_errors.UnauthenticatedAccess_new)
        * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>

<a name="errors.AppError"></a>

### errors.AppError
A base class for all custom errors which app can throw.

**Kind**: static class of <code>[errors](#errors)</code>  

* [.AppError](#errors.AppError)
    * [new AppError(message, error)](#new_errors.AppError_new)
    * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>

<a name="new_errors.AppError_new"></a>

#### new AppError(message, error)
Initialize a AppError.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | The beutified error message. |
| error | <code>String</code> | The internal error. |

<a name="errors.AppError+toJSON"></a>

#### appError.toJSON() ⇒ <code>Object</code>
Convert instance to plain JavaScript object.

**Kind**: instance method of <code>[AppError](#errors.AppError)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="errors.ValidationError"></a>

### errors.ValidationError ⇐ <code>[AppError](#errors.AppError)</code>
A class for validations errors which app can throw.

**Kind**: static class of <code>[errors](#errors)</code>  
**Extends:** <code>[AppError](#errors.AppError)</code>  

* [.ValidationError](#errors.ValidationError) ⇐ <code>[AppError](#errors.AppError)</code>
    * [new ValidationError(error)](#new_errors.ValidationError_new)
    * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>

<a name="new_errors.ValidationError_new"></a>

#### new ValidationError(error)
Initialize a ValidationError.


| Param | Type | Description |
| --- | --- | --- |
| error | <code>String</code> | The internal error. |

<a name="errors.AppError+toJSON"></a>

#### validationError.toJSON() ⇒ <code>Object</code>
Convert instance to plain JavaScript object.

**Kind**: instance method of <code>[ValidationError](#errors.ValidationError)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="errors.UnauthorizedAccess"></a>

### errors.UnauthorizedAccess ⇐ <code>[AppError](#errors.AppError)</code>
A error class app can throw for unauthorized access .

**Kind**: static class of <code>[errors](#errors)</code>  
**Extends:** <code>[AppError](#errors.AppError)</code>  

* [.UnauthorizedAccess](#errors.UnauthorizedAccess) ⇐ <code>[AppError](#errors.AppError)</code>
    * [new UnauthorizedAccess(error)](#new_errors.UnauthorizedAccess_new)
    * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>

<a name="new_errors.UnauthorizedAccess_new"></a>

#### new UnauthorizedAccess(error)
Initialize a unauthorized access error.


| Param | Type | Description |
| --- | --- | --- |
| error | <code>String</code> | The internal error. |

<a name="errors.AppError+toJSON"></a>

#### unauthorizedAccess.toJSON() ⇒ <code>Object</code>
Convert instance to plain JavaScript object.

**Kind**: instance method of <code>[UnauthorizedAccess](#errors.UnauthorizedAccess)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="errors.UnauthenticatedAccess"></a>

### errors.UnauthenticatedAccess ⇐ <code>[AppError](#errors.AppError)</code>
A error class app can throw for unauthenticated access .

**Kind**: static class of <code>[errors](#errors)</code>  
**Extends:** <code>[AppError](#errors.AppError)</code>  

* [.UnauthenticatedAccess](#errors.UnauthenticatedAccess) ⇐ <code>[AppError](#errors.AppError)</code>
    * [new UnauthenticatedAccess(error)](#new_errors.UnauthenticatedAccess_new)
    * [.toJSON()](#errors.AppError+toJSON) ⇒ <code>Object</code>

<a name="new_errors.UnauthenticatedAccess_new"></a>

#### new UnauthenticatedAccess(error)
Initialize a unauthenticated access error.


| Param | Type | Description |
| --- | --- | --- |
| error | <code>String</code> | The internal error. |

<a name="errors.AppError+toJSON"></a>

#### unauthenticatedAccess.toJSON() ⇒ <code>Object</code>
Convert instance to plain JavaScript object.

**Kind**: instance method of <code>[UnauthenticatedAccess](#errors.UnauthenticatedAccess)</code>  
**Returns**: <code>Object</code> - A plain JavaScript object.  
<a name="handle"></a>

## handle(req, res, error) ⇒ <code>null</code>
A error handler middlware: checks if error is thrown from the App or from an
internal library, then returns a customized error message to the client with
an appropriate status.

**Kind**: global function  
**Returns**: <code>null</code> - null  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | A http(s) request object. |
| res | <code>Response</code> | A http(s) response object. |
| error | <code>Error</code> | Error to be handled. |

