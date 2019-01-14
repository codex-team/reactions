# Reactions

Light-weight module for gathering users' feedback on a webpage content
Allows to build in element, containing buttons - emojis for expressing attitude to a content

## Getting started

### Installation 

#### npm or Yarn

```bash
npm install @codexteam/reactions
```

or

```bash
yarn add @codexteam/reactions
```

#### Download from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@codexteam/reactions"></script>
```

## Usage

### Simplified initialization

1 Connect reactions.js script to your page
2 Create an instance of Reactions using 

```javascript
new Reactions({parent: '', title: '', reactions: []});
```

where

| name      | type                      | description                                                               |
|-----------|---------------------------|---------------------------------------------------------------------------|
| parent    | `string` or `HTMLElement` | element in which module should be inserted - selector or element instance |
| title     | `string`                  | module title                                                              |
| reactions | `string[]`                | array of emojis to be inserted in module options                          |

> Example

```javascript
new Reactions({parent: 'body', title: 'What do you think?', reactions: ['👍', '👌', '👎']});
```

### Advanced settings

#### Identify user

Module uses userId property to identify user - by default userId is random number, but it can be specified through setUserId method

| name   | type     | description     |
|--------|----------|-----------------|
| userId | `number` | user identifier |

> example:

```javascript
  Reactions.setUserId(1);
```
#### Identify module

By default module takes page URL as module identifier, but it also can be specified manually by passing id to reactions constructor

use it for:
* lists (different modules on one page)
* binding module to a specific content item, regardless of URL

in this case instance should be created this way

```javascript
new Reactions({parent: '', title: '', reactions: [], id: ''});
```

where

| name  | type                 | description       |
|-------|----------------------|-------------------|
| id    | `string` or `number` | module identifier |
