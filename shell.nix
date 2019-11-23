with import <nixpkgs> {};
mkShell {
    buildInputs = [
        clang-tools
        htmlTidy
        nodejs
        shellcheck
    ];
    shellHook = ''
        . .shellhook
    '';
}
