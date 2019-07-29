with import <nixpkgs> {};
mkShell {
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
