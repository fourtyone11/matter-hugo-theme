+++
title = "Советы по установке и настройке Archlinux"
description = "Советики"
date = "2020-02-01"
draft = true
+++

## Установка и настройка archlinux

Тут собраны советы по установке и настройке archlinux.

гайд по установке смотреть на официальном [сайте](https://wiki.archlinux.org/index.php/Installation_guide)

### Разметка Диска

До этого момента надо делать все как в гайде.

Для разбития пользуйтесь fdisk

Если ставим на virtualbox, то разбиваем для bios. Для mbr не нужен boot.

диск разбиваем на 4 части (для uefi):

| Название раздела | Размер          | Тип        |
| ---------------- | --------------- | ---------- |
| boot             | 260M            | EFI System |
| root             | 50G             | Linux root |
| swap             | RAM.size / 2    | Linux swap |
| home             | Оставшийся диск | Linux home |

после: монтируем.

### Установка

Ставим арч через `pacstrap` и выполняем инструкции по гайду.

Ставим нужный софт

```sh
iwd dhcpcd NetworkManager nvim man-db man-pages
```

загрузчик `systemd-boot`

```sh
bootctl --path=esp install
```

**esp** - путь до раздела загрузчика

далее прописать конфиг - `/esp/loader/entries/arch.conf`

```
title Arch Linux
linux /vmlinuz-linux
intrd /amd-ucode.img
initrd /initramfs-linux.img
options root=/dev/nvme0n1p2 rw
```

`root=/dev/nvme0n1p2` - путь до корневого раздела

Если не получилость то использовать команду `efibootmgr`

```sh
efibootmgr -c -d /dev/sdX -p Y -l "\EFI\systemd\systemd-bootx64.efi" -L "Linux Boot Manager"
```

Если не нравится systemd-boot, можно [grub](https://wiki.archlinux.org/index.php/GRUB)

И все можно перезагружаться.

## Настройка пользователя

Создание пользователя

```sh
useradd -m -G wheel username
passwd username
```

## AUR

Для управления пакетами из пользовательского репозитория можно поставить `yay`

Ставится просто :

```sh
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

## Оконный менеджер

Я выбрал `sway`. Он на wayland, конфиг совместим с i3.

### Конфиг

Русская раскладка и контрол вместо капс лока.

input * xkb_layout "us,ru"
input * xkb_options "ctrl:nocaps,grp:alt_shift_toggle"

Биндинги для регулировки громкости, яркости экрана на ноутбуке

bindsym XF86AudioRaiseVolume exec pactl set-sink-volume 0 +5%
bindsym XF86AudioLowerVolume exec pactl set-sink-volume 0 -5%
bindsym XF86AudioMute exec pactl set-sink-mute 0 toggle
bindsym XF86MonBrightnessUp exec light -A 10
bindsym XF86MonBrightnessDown exec light -U 10

Для него еще нужно поставить пару софтинок:
`wofi` - для запуска программ. Установка:  `yay -S wofi`

`imw` - для просмотра изображений. Установка: 

```sh
git clone https://github.com/eXeC64/imv.git
meson builddir/
ninja -C builddir/
ninja -C builddir/ install
```

**если нужно**
sudo ln -s /path/to/imv /usr/local/bin

`grim` - для скриншотов. Установка: `yay -S grim-git`

`slurp` - для выбора области на экране для скриншотов.

Установка:

```
meson build
ninja -C build
build/slurp
sudo ln -s /path/to/slurp /usr/local/bin
```

## Терминал

Я ставлю [alacritty](https://github.com/alacritty/alacritty)

По моему он самый быстрый и удобный и еще написан на расте.

## Конфиг

настройка шрифта. Нужно чтобы он был monospace.

{{< highlight yaml >}}
{{< / highlight >}}

## Софт для терминала

`lf`

## Tmux и vim

если в `alacritty` `tmux` не правильно отображает фон в `vim` или `nvim`, то следует в конфиге раскомментировать переменную окружения `$TERM`

```yaml
env:
  TERM: xterm-256color
```

в конфиге tmux(~/.tmux.conf) прописать:

```
set -g default-terminal 'tmux-256color'
set -ga terminal-overrides ',*256col*:Tc'
```

## Оболочка коммандной строки

Мне нравится `fish`
Установка `pacman -S fish`

## Конфиг

например вот так:

