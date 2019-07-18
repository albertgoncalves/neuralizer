{ pkgs ? import <nixpkgs> {} }:
with pkgs; mkShell {
    name = "neuralizer";
    buildInputs = [
        htmlTidy
        nodejs-8_x
    ];
    shellHook = ''
        . .shellhook
    '';
}
