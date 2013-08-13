# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi

if [ -n "$UNDER_JHBUILD" ]; then
    PS1="[jhbuild] "
    cd $HOME/gnome
fi
