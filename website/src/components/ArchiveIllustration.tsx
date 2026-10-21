export function ArchiveIllustration() {
  return <figure className="archive-figure">
    <svg className="archive-art" viewBox="0 0 580 590" role="img" aria-labelledby="room-title room-desc">
      <title id="room-title">An imagined sunlit reading room</title>
      <desc id="room-desc">An original decorative illustration: an arched window, warm shelves and three abstract demo volumes. It depicts no real library or scientific apparatus.</desc>
      <defs>
        <linearGradient id="wall" x1="0" x2="1" y2="1"><stop stopColor="#e5d6b9"/><stop offset="1" stopColor="#faf1d9"/></linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fcf8e8"/><stop offset="1" stopColor="#d3d9be"/></linearGradient>
        <linearGradient id="floor" x1="0" x2="1"><stop stopColor="#b89c73"/><stop offset="1" stopColor="#e5cda2"/></linearGradient>
        <linearGradient id="table" x1="0" x2="1"><stop stopColor="#705340"/><stop offset="1" stopColor="#a1805d"/></linearGradient>
        <clipPath id="arch"><path d="M137 406V203a145 145 0 0 1 290 0v203Z"/></clipPath>
        <filter id="shadow"><feDropShadow dx="1" dy="9" stdDeviation="9" floodColor="#302516" floodOpacity=".18"/></filter>
      </defs>
      <path fill="url(#wall)" d="M0 0h580v590H0z"/>
      <path fill="#d2bf9c" d="M99 426V200a183 183 0 0 1 366 0v226Z"/>
      <path fill="#a58d67" d="M117 421V204a165 165 0 0 1 330 0v217Z"/>
      <path fill="url(#window)" d="M137 406V203a145 145 0 0 1 290 0v203Z"/>
      <g clipPath="url(#arch)">
        <path d="M145 406c30-70 49-140 43-235m5 129c-39-25-58-48-71-79m67 46c38-16 59-41 80-79m-74 48c-16-45-7-76 7-100" stroke="#829075" strokeWidth="3" fill="none" opacity=".4"/>
        <path fill="#abb792" opacity=".35" d="M158 222c-30-18-29-44-34-53 35 10 42 22 34 53m39-29c-3-36 13-51 29-64 7 39-6 55-29 64m25 56c19-34 40-36 60-37-19 29-30 39-60 37m-43 67c-25-11-38-29-41-49 30 7 41 21 41 49"/>
        <path fill="#fffbed" opacity=".65" d="M322 42h90L185 406h-79Z"/>
      </g>
      <g stroke="#8a7556" strokeWidth="8" fill="none"><path d="M282 62v344M137 238h290M137 402h290"/></g>
      <path fill="#bea37c" d="M102 406h361v19H102z"/>
      <path fill="#ead5ac" d="M0 448h580v142H0z"/>
      <path fill="url(#floor)" d="M0 491h580v99H0z"/>
      <path fill="#fff1c8" opacity=".5" d="m332 425 224 165H204L152 425Z"/>
      <path fill="#795d43" d="M0 132h63v341H0zM512 132h68v341h-68z"/>
      <g fill="#9b7d55"><path d="M0 257h63v10H0zM0 383h63v10H0zM512 257h68v10h-68zM512 383h68v10h-68z"/></g>
      <g fill="#c4b088"><path d="M5 176h11v81H5zM22 163h14v94H22zM41 183h12v74H41zM520 170h12v87h-12zM538 180h10v77h-10zM554 154h16v103h-16zM7 297h14v86H7zM29 309h10v74H29zM45 287h12v96H45zM521 304h12v79h-12zM539 293h15v90h-15zM561 312h11v71h-11z"/></g>
      <ellipse cx="293" cy="523" rx="203" ry="23" fill="#493527" opacity=".13"/>
      <g filter="url(#shadow)">
        <path fill="url(#table)" d="m79 454 366-17 64 43-363 26Z"/>
        <path fill="#604a37" d="M146 506v11l363-26v-11Z"/>
        <path fill="#71533d" d="m161 516 15 74h15l-2-76m277-19 7 95h15l4-98"/>
        <g transform="translate(187 232) rotate(-7 75 120)">
          <path fill="#2e483c" d="M0 0h144v225H0z"/>
          <path fill="#48604a" d="M8 0h136v225H8z"/>
          <path stroke="#c5b97e" fill="none" opacity=".8" d="M20 13h111v197H20zM32 119c55-52 83-10 89 2M34 110c11 50 68 62 84 7"/>
          <text x="27" y="40" fill="#f8f0d9" fontSize="11" letterSpacing="2">ANAVELD</text>
          <text x="27" y="69" fill="#f8f0d9" fontFamily="Georgia,serif" fontSize="17"><tspan x="27">A closer</tspan><tspan x="27" dy="22">look.</tspan></text>
          <text x="27" y="190" fill="#f8f0d9" fontSize="8" letterSpacing="1">DEMO VOLUME</text>
        </g>
        <g transform="translate(318 311) rotate(10)"><path fill="#263a47" d="M0 0h90v152H0z"/><path stroke="#b5b99e" fill="none" d="M10 12h70v128H10zM23 73h45M23 83h45M23 93h45"/><text x="17" y="35" fill="#f8f0d9" fontSize="8" letterSpacing="1">ANAVELD</text><text x="17" y="124" fill="#f8f0d9" fontSize="7">DEMO</text></g>
        <path fill="#b18b61" d="m227 466 109-7 57 18-110 9Z"/><path fill="#f4ead4" d="m228 460 109-7 56 19-110 8Z"/>
      </g>
      <path d="M34 40h31m-15-15v31M490 547h27m-13-13v27" stroke="#9f824f" strokeWidth="1"/>
    </svg>
    <figcaption><span>FIG. 01</span> An imagined reading room <span className="figure-diamond">◇</span></figcaption>
  </figure>;
}
