const fs = require('fs');
const file = 'src/components/Hero.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. State changes
code = code.replace(
  /const \[scrollProgress, setScrollProgress\] = useState\(0\);\s*const \[windowHeight, setWindowHeight\] = useState\(1000\);\s*const \[isBulbHit, setIsBulbHit\] = useState\(false\);\s*const heroRef = useRef\(null\);/g,
  "const [windowHeight, setWindowHeight] = useState(1000);\n  const [isBulbHit, setIsBulbHit] = useState(false);\n  const [activeStep, setActiveStep] = useState(0);\n  const [isBulbSwinging, setIsBulbSwinging] = useState(false);\n  const heroRef = useRef(null);\n  const b1Ref = useRef(null);\n  const b2Ref = useRef(null);\n  const b3Ref = useRef(null);\n  const activeStepRef = useRef(0);\n  const bulbSwingingRef = useRef(false);"
);

// 2. Add initial CSS vars to useEffect
code = code.replace(
  /window\.addEventListener\("deviceorientation", handleOrientation\);\s*return \(\) => \{/g,
  "window.addEventListener(\"deviceorientation\", handleOrientation);\n    if (heroRef.current) {\n        const h = heroRef.current.style;\n        h.setProperty('--sp', 0);\n        h.setProperty('--b1-y', '0vh');\n        h.setProperty('--b1-o', 1);\n        h.setProperty('--b2-y', '100vh');\n        h.setProperty('--b2-o', 0);\n        h.setProperty('--b3-y', '100vh');\n        h.setProperty('--b3-o', 0);\n        h.setProperty('--isy', '0px');\n        h.setProperty('--rp', 0);\n        h.setProperty('--rp-pct', 100);\n    }\n    return () => {"
);

// 3. Replace useLenis and all the math
const newMath = "useLenis(({ scroll }) => {\n    if (!heroRef.current) return;\n    const top = heroRef.current.offsetTop;\n    const rectTop = top - scroll;\n    let progress = 0;\n    if (rectTop <= 0) {\n      progress = Math.max(0, Math.min(5, -rectTop / windowHeight));\n    }\n    \n    const t1 = Math.max(0, Math.min(1, progress));\n    const t2 = Math.max(0, Math.min(1, progress - 1.2));\n    \n    const b1Y = -t1 * 50;\n    const b1Opacity = 1 - t1;\n    \n    const b2Y = t1 < 1 ? (1 - t1) * 100 : -t2 * 50;\n    const b2Opacity = t1 < 1 ? t1 : (1 - t2);\n    \n    const b3Y = (1 - t2) * 100;\n    const b3Opacity = t2;\n    \n    const rp = Math.max(0, Math.min(1, (progress - 2.2) / 2.3));\n    const maxScroll = window.innerWidth < 768 ? 650 : 600;\n    const isy = -rp * maxScroll;\n    \n    const h = heroRef.current.style;\n    h.setProperty('--sp', progress);\n    h.setProperty('--b1-y', b1Y + 'vh');\n    h.setProperty('--b1-o', b1Opacity);\n    h.setProperty('--b2-y', b2Y + 'vh');\n    h.setProperty('--b2-o', b2Opacity);\n    h.setProperty('--b3-y', b3Y + 'vh');\n    h.setProperty('--b3-o', b3Opacity);\n    h.setProperty('--isy', isy + 'px');\n    h.setProperty('--rp', rp);\n    h.setProperty('--rp-pct', 100 - (rp * 100));\n\n    if (b1Ref.current) b1Ref.current.style.pointerEvents = progress < 0.8 ? 'auto' : 'none';\n    if (b2Ref.current) b2Ref.current.style.pointerEvents = (progress > 0.2 && progress < 2.0) ? 'auto' : 'none';\n    if (b3Ref.current) b3Ref.current.style.pointerEvents = progress > 1.8 ? 'auto' : 'none';\n\n    if (progress > 0.4 && !bulbSwingingRef.current) {\n       bulbSwingingRef.current = true;\n       setIsBulbSwinging(true);\n    }\n\n    let step = 0;\n    if (rp >= 0.85) step = 4;\n    else if (rp >= 0.67) step = 3;\n    else if (rp >= 0.40) step = 2;\n    else if (rp >= 0.13) step = 1;\n    \n    if (step !== activeStepRef.current) {\n      activeStepRef.current = step;\n      setActiveStep(step);\n    }\n  });";

// Regex to replace from `useLenis` up to just before `return (`
code = code.replace(/useLenis\(\(\{ scroll \}\) => \{[\s\S]*?const innerScrollY = -roadmapProgress \* maxScroll;/g, newMath);

// 4. Update the JSX blocks to use CSS variables
// BLOCK 1
code = code.replace(/className="absolute inset-0 flex flex-col justify-center px-margin-mobile md:px-margin-desktop"\s*style=\{\{\s*transform: b1Transform,\s*opacity: b1Opacity,\s*transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',\s*pointerEvents: scrollProgress < 0.8 \? 'auto' : 'none',\s*willChange: 'transform, opacity'\s*\}\}/g,
"ref={b1Ref}\n          className=\"absolute inset-0 flex flex-col justify-center px-margin-mobile md:px-margin-desktop\"\n          style={{ \n            transform: 'translate3d(0, var(--b1-y), 0)', \n            opacity: 'var(--b1-o)',\n            willChange: 'transform, opacity'\n          }}");

// BLOCK 2
code = code.replace(/className="absolute inset-0 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop"\s*style=\{\{\s*transform: b2Transform,\s*opacity: b2Opacity,\s*transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',\s*pointerEvents: \(scrollProgress > 0.2 && scrollProgress < 2.0\) \? 'auto' : 'none',\s*willChange: 'transform, opacity'\s*\}\}/g,
"ref={b2Ref}\n          className=\"absolute inset-0 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop\"\n          style={{ \n            transform: 'translate3d(0, var(--b2-y), 0)', \n            opacity: 'var(--b2-o)',\n            willChange: 'transform, opacity'\n          }}");

// BLOCK 3
code = code.replace(/className="absolute inset-0 flex flex-col justify-start items-center text-left pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop"\s*style=\{\{\s*transform: b3Transform,\s*opacity: b3Opacity,\s*transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',\s*pointerEvents: scrollProgress > 1.8 \? 'auto' : 'none',\s*willChange: 'transform, opacity'\s*\}\}/g,
"ref={b3Ref}\n          className=\"absolute inset-0 flex flex-col justify-start items-center text-left pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop\"\n          style={{ \n            transform: 'translate3d(0, var(--b3-y), 0)', \n            opacity: 'var(--b3-o)',\n            willChange: 'transform, opacity'\n          }}");

// 5. Replace inline calc variables
code = code.replace(/\{scrollProgress \* 200\}px/g, 'calc(var(--sp) * 200px)');
code = code.replace(/\{scrollProgress \* 150\}px/g, 'calc(var(--sp) * 150px)');
code = code.replace(/\{scrollProgress \* 120\}px/g, 'calc(var(--sp) * 120px)');
code = code.replace(/\{scrollProgress \* 180\}px/g, 'calc(var(--sp) * 180px)');
code = code.replace(/\{scrollProgress \* 130\}px/g, 'calc(var(--sp) * 130px)');
code = code.replace(/\{scrollProgress \* 80\}px/g, 'calc(var(--sp) * 80px)');

// 6. Replace innerScrollY
code = code.replace(/\{innerScrollY \* 0.1\}px/g, 'calc(var(--isy) * 0.1)');
code = code.replace(/\{innerScrollY \* 0.25\}px/g, 'calc(var(--isy) * 0.25)');
code = code.replace(/\{innerScrollY \* 0.45\}px/g, 'calc(var(--isy) * 0.45)');
code = code.replace(/\{innerScrollY\}px/g, 'var(--isy)');

// 7. Lightbulb swinging check
code = code.replace(/\{scrollProgress > 0\.4 && \(/g, '{isBulbSwinging && (');

// 8. Roadmap progress line
code = code.replace(/strokeDashoffset=\{100 - roadmapProgress \* 100\}/g, 'strokeDashoffset="var(--rp-pct)"');

// 9. Roadmap active state loop
code = code.replace(/const isActive = roadmapProgress >= step\.activeAt;/g, 'const isActive = activeStep > idx;');

fs.writeFileSync(file, code);
console.log('Fixed successfully!');
