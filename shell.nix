{ pkgs ? import <nixpkgs> {} }:

with pkgs; mkShell {
    name = "javascript";

    buildInputs = [ htmlTidy
                    nodejs-8_x
                    fzf
                    tmux
                  ];

    shellHook = ''
        if [ ! -e node_modules/.bin/jshint ]; then
            npm install --save-dev jshint
        fi

        export PATH="$PWD/node_modules/.bin/:$PATH"

        fzfh() { find . | fzf; }
        strcd() { cd "$(dirname $1)"; }
        withfzf() {
            local h
            h="$(fzf --exact)"
            if (( $? == 0 )); then
                $1 $h
            fi
        }

        alias cdfzf="withfzf strcd"
        alias jshfzf="withfzf jshint"
        alias runfzf="withfzf node"
        alias tidfzf="withfzf tidy"
        alias vimfzf="withfzf vim"

        export -f fzfh
        export -f withfzf
    '';
}
