const rH = () => ((Math.random() * 16) | 0).toString(16);
const rUH = () => ((Math.random() * 4) | 8).toString(16);

export const uniqueIdentifier = (): string => {
  const a = rH(),
    b = rH(),
    c = rH(),
    d = rH(),
    e = rH(),
    f = rH(),
    g = rH(),
    h = rH(),
    i = rH(),
    j = rH(),
    k = rH(),
    l = rH(),
    m = rH(),
    n = rH(),
    o = rH(),
    p = rUH(),
    q = rH(),
    r = rH(),
    s = rH(),
    t = rH(),
    u = rH(),
    v = rH(),
    w = rH(),
    x = rH(),
    y = rH(),
    z = rH(),
    aa = rH(),
    ab = rH(),
    ac = rH(),
    ad = rH(),
    ae = rH();
  return `${a}${b}${c}${d}${e}${f}${g}${h}-${i}${j}${k}${l}-4${m}${n}${o}-${p}${q}${r}${s}-${t}${u}${v}${w}${x}${y}${z}${aa}${ab}${ac}${ad}${ae}`;
};
