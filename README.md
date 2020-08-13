# Matter

![Matter](https://github.com/fourtyone11/matter-hugo-theme/blob/master/images/tn.png)

## Features

- fully responsive
- [fuse.js](https://fusejs.io/) search
- ru/eng support

## Installation

1. install hugo 

  `pacman -S hugo` for archlinux

  for your os: google it!

2. `hugo new site <site_name>`

3. download a theme

```
cd <site_name>
git init
git submodule add https://github.com/fourtyone11/matter-hugo-theme themes/matter
```

4 install dependencies

```
cd themes/matter
npm install
```

4. add theme in config

```toml
theme = "matter"
```

5. run server `hugo server`

## Code hightlighting

It using [chroma](https://github.com/alecthomas/chroma) hightlighting.

theme [darcula](https://draculatheme.com)

configure it in `config.toml`

config [docs](https://gohugo.io/getting-started/configuration-markup/#highlight)


