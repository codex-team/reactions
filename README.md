# Reactions

Light-weight module for gathering users' feedback on a webpage content
Allows to build in element, containing buttons - emojis for expressing attitude to a content

## Getting started

### Installing 

Download script from this github repository

## Usage

### Simplified initialization

* connect reactions.js to your html page in script tag
* create instance of Reactions using 
```
new Reactions({parent: '', title: '', reactions: []});
```
where

| name      | type   | description                                       |
|-----------|--------|---------------------------------------------------|
|parent     |string  |element in which module should be inserted - string|
|title      |string  |module title                                       |
|reactions  |string[]|array of emojis to be inserted in module options   |

**example:**

```
new Reactions({parent: 'body', title: 'What do you think?', reactions: ['😁', '😁', '😁']});
```
### Advanced settings

Module uses userId property to identify user - by default userId is random number, but it can be specified through setUserId method

| name  | type  | description    |
|-------|------ |----------------|
|userId |number |user identifier |

**example*

```
  Reactions.setUserId(1);
```

By default module takes page URL as module identifier, but it also can be specified manually by passing id to reactions constructor

use it for:
* lists (different modules on one page)
* binding module to a specific content item, regardless of URL

in this case instance should be created this way
```
new Reactions({parent: '', title: '', reactions: [], id: ''});
```

where

| name | type            | description      |
|------|-----------------|------------------|
|id    |string or number |module identifier |





