# Reactions
Light-weight reactions module
Allows to build in buttons with reactions - emojis in order to gain users' feedback on a webpage

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
where\
**parent** - element in which module should be inserted - string\
**title** - module title - string\
**reactions** - array of emojis to be inserted in module options - string[]\
\
**example:**
```
new Reactions({parent: 'body', title: 'What do you think?', reactions: ['😁', '😁', '😁']});
```
### Advanced settings
By default module takes page url as module identifier, but it also can be specified manually by passing id to reactions constructor
in this case instance should be created this way:\
```
new Reactions({parent: '', title: '', reactions: [], id: ''});
```
where\
id - module identifier - string | number





