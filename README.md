# switch

> Carousels, accordions, tab switching and etc.

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using switch In Your Project

First, install 'switch' directly with `cortex install` (recommended)
	
	cortex install switch --save
	
or, you could update your package.json manually
    
    dependencies: {
        'switch': '<version-you-want>'
    }
    
and install dependencies
	
	cortex install
    
Then, use `require` method in your module
    
    var switch = require('switch');
    
Finally, start cortex server
    
    cortex server
    
Then cortex will care all the rest.


## API Documentation

### switch: constructor
': constructor' means the `module.exports` of module 'switch' is a constructor that we should use it with the `new` keyword

	new switch(options)
	
#### options
- options.name {String}



### switch.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here