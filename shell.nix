{ pkgs ? import <nixpkgs> {} }:
with pkgs; mkShell {
    name = "neuralizer";
    buildInputs = [
        clang-tools
        htmlTidy
        nodejs-8_x
        shellcheck
    ];
    shellHook = ''
        . .shellhook
    '';
}
