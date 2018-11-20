# Reactions
Light-weight reactions module
## Getting started
### Installing 
Download script from this github repository or add via npm (in work)
## Usage
### Simplified initialization
* connect reactions.js to your html page in script tag
* create instance of Reactions using 
```
new Reactions({parent: '', title: '', reactions: []});
```
where parent - element in which poll should be inserted\
      title - poll title\
      reactions - array of emojis to be inserted in poll options\
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





