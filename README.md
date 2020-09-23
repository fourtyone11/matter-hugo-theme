# Matter

![Matter](https://github.com/fourtyone11/matter-hugo-theme/blob/master/images/tn.png)

## Features

- fully responsive
- search
- ru/eng support

## Installation

1. Install hugo

  `pacman -S hugo` for archlinux

  for your os: google it!

2. Create new site `hugo new site <site_name>`

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

## Config

see `exampleSite/config.toml`

## Blog settings

To add preview image for blogpost create `{{blogpostname}}` folder in `content/posts` and put an image named `preview.{jpg,png,webp}`.

## Project settings

To show image on project page put images named `image*.{jpg,png,webp}` to `content/project/myproject` folder.

## Project params

```toml
project_link = "https://project.com"
project_repo = "https://github.com/myname/myproject"
tech_stack = [ { name = "tech_name", description = "tech description", link = "link to website" } ]
```

## Font awesome

To get icons create [starter kit](https://fontawesome.com/start) and add `fontAwesomeKit` link to params

```toml
[params]
  fontAwesomeKit = "<script src='https://kit.fontawesome.com/{id}.js' crossorigin='anonymous'></script>"
```
