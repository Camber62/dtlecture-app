const replace: string[] = [
    "alpha", "Alpha", "beta", "Beta", "gamma", "Gamma", "pi", "Pi", "phi", "varphi", "mu", "Phi", "varPhi",
    "cos", "sin", "theta", "lim", "to", "infty", "exp", "bmod", "equiv", "pmod", "binom", "times", "sfrac",
    "dots", "cfrac", "left", "right", "sqrt", "sum_", "int", "frac", "mathrm", "sum", "bigoplus", "bigcup",
    "bigsqcup", "iiint", "prod", "bigotimes", "bigcap", "bigvee", "oint", "iiiint", "coprod", "bigodot",
    "biguplus", "bigwedge", "iint", "idotsint", "langle", "rangle", "lfloor", "rfloor", "lceil", "rceil",
    "ulcorner", "urcorner", "backslash", "displaystyle", "begin{bmatrix}", "end{bmatrix}", "begin{equation}",
    "end{equation}", "begin{array}", "end{array}", "begin{pmatrix}", "end{pmatrix}", "leq", "geq", "neq",
    "approx", "sim", "propto", "delta", "Delta", "epsilon", "varepsilon", "zeta", "eta", "kappa",
    "lambda", "Lambda", "rho", "sigma", "Sigma", "tau", "upsilon", "Upsilon", "chi", "psi", "Psi",
    "omega", "Omega", "forall", "exists", "neg", "wedge", "vee", "Rightarrow", "Leftrightarrow",
    "circ", "cdot", "ldots", "vdots", "ddots", "textVar", "mathbb", "in", "text", "partial", "partialt",
    "nabla", "hbar", "cdotp"
];

export const ReplaceLatex = (text: string): string => {

    text = text
        .replaceAll(/\$([\s\S]+?)\$/g, "$$" + "$1" + "$$")
        .replaceAll(/\$\$/g, "\$")
        .replaceAll(/`/g, '')
        .replaceAll("\\\\\\\\", "\\\\")

    for (const item of replace) {
        text = text.replaceAll(`\\\\${item}`, `\\${item}`)
    }
    return text

}
