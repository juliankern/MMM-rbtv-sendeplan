# Module: RBTV Sendeplan
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows the RBTV Sendeplan.

The shows are fetched from [RocketBeansAPI](https://github.com/rocketbeans/rbtv-apidoc).

![screenshot](https://user-images.githubusercontent.com/185757/83696101-dd83d400-a5fb-11ea-9b11-1aca19ff82bd.png)

# Installation
1. Clone repo:
```
cd MagicMirror/modules/
git clone https://github.com/juliankern/MMM-rbtv-sendeplan
```
2. Add the module to the ../MagicMirror/config/config.js, example:
```
{
    module: "MMM-rbtv-sendeplan",
    header: "RBTV Sendeplan",
    position: "bottom_right",
    config: {}
},
```
# Configuration
| Option                        | Description
| ------------------------------| -----------
| `updateInterval`              | How often the sendeplan should update.<br />**Default value:** 30 * 1000 (= 30s)
| `maxNewItems`                 | How many shows after the running one should be displayed.<br />**Default value:** 5
| `initialLoadDelay`            | Load delay after initialising.<br />**Default value:** 0
| `showWidth`                   | Width of each show.<br />**Default value:** 400px
| `imageWidth`                  | Width of the shows image.<br />**Default value:** 100px
| `imageGrayscale`              | If the show image should be displayed greyscale.<br />**Default value:** false
| `showImages`                  | Show the images.<br />**Default value:** true
| `fontScale`                   | Scale of the fonts.<br />**Default value:** 1
