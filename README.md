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
**parent** - element in which module should be inserted\
**title** - module title\
**reactions** - array of emojis to be inserted in module options\
\
**example:**
```
new Reactions({parent: 'body', title: 'What do you think?', reactions: ['😁', '😁', '😁']});
```
### Advanced settings
Reactions constructor can also accept module identifier  - id
in this case instance should be created this way:\
```
new Reactions({parent: '', title: '', reactions: [], id: ''});
```





