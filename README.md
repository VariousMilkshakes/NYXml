# NYXml
Lite markup for styx forum posts

### Syntax
`prefix` `editor` &nbsp; `option` = `value` &nbsp; `options...` > `content`

### Prefixes
`_` : Underline

`^` : Bold

`/` : Italics

`-` : Strike through

`>` : Nest element

### Rules and Options
`pg` : text paragraph
- `txs` Font size : **px**
- `col` Color of font : **hex**
- `bgc` Background color : **hex**

`h1` : Large header
- `txs` Font size : **px**
- `col` Color of font : **hex**
- `bgc` Background color : **hex**
- `aln` Alignment : **left** / **right** / **mid**

`h2` : Medium header
- `txs` Font size : **px**
- `col` Color of font : **hex**
- `bgc` Background color : **hex**
- `aln` Alignment : **left** / **right** / **mid**

`h3` : Small header
- `txs` Font size : **px**
- `col` Color of font : **hex**
- `bgc` Background color : **hex**
- `aln` Alignment : **left** / **right** / **mid**

`ig` : Image
- `src` Image source : **url**
- `hgt` Height of image : **px**
- `wdt` Width of image : **px**

`hr` : Horizontal Rule
- `wdt` Width of rule : **%**
- `hgt` Height of rule : **px**

`sl` : Start a list
- `typ` Type of list : **num** / **point**

`le` : List element

`el` : End a list

#### Global
`set` : Sets up global formatting

`content` should be left `blank` or replaced with a `rule`

### Usage Example
##### Set default formatting
```
//This will apply the css as default to all elements
  set txs=20>
//This will apply the css as default to only h2
  set col=#f00>h2
```

##### Nest an element
```
sl>
le>
le>
>h1>Yop
>el
```
