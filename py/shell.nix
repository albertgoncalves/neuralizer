{ pkgs ? import <nixpkgs> {} }:

with pkgs; mkShell {
    name = "python";

    buildInputs = [ python36
                    python36Packages.numpy
                    python36Packages.sklearn-deap
                    python36Packages.flake8
                    fzf
                  ];

    shellHook = ''
        copyfile() { cat $1 | pbcopy; }
        strcd() { cd "$(dirname $1)"; }
        withfzf() {
            local h
            h=$(fzf)
            if (( $? == 0 )); then
                $1 "$h"
            fi
        }

        alias cpyfzf="withfzf copyfile"
        alias cdfzf="withfzf strcd"
        alias runfzf="withfzf python3"
        alias vimfzf="withfzf vim"
        alias flake8="flake8 --ignore E124,E128,E201,E203,E241,W503"

        export -f copyfile
        export -f withfzf
    '';
}
