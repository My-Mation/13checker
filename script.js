const testimonials = [
  {text: "This changed my life. I now know if numbers are 13.", who: "Pratham K."},
  {text: "Incredible technology. Worth billions.", who: "A. Reviewer"},
  {text: "I used this daily to check my taxes.", who: "S. Beta"}
];

let scanController = { running: false };
let gridEl = null;

function createCarousel() {
  const root = document.getElementById('carousel');
  const inner = document.createElement('div');
  inner.className = 'carousel-inner';
  root.appendChild(inner);
  // Disable 3D rotation and auto-animate on small/touch devices to avoid glitchy behavior.
  const isMobile = window.matchMedia('(max-width:520px)').matches;
  const count = testimonials.length;
  const angleStep = 360 / count;
  const radius = 320; // visual radius

  testimonials.forEach((t,i)=>{
    const card = document.createElement('div');
    card.className = 'card';
    // Only apply 3D transform positioning on non-mobile
    if(!isMobile){
      card.style.transform = `rotateY(${i*angleStep}deg) translateZ(${radius}px)`;
    }
    card.innerHTML = `<div class="quote">“${t.text}”</div><div class="who">${t.who}</div>`;
    inner.appendChild(card);
  });

  if(!isMobile){
    let idx = 0;
    setInterval(()=>{
      idx = (idx+1) % count;
      inner.style.transform = `rotateY(${-idx*angleStep}deg)`;
    }, 3000);
  } else {
    // Ensure no transform is applied on mobile
    inner.style.transform = '';
    inner.style.transition = 'none';
  }
}

function createGrid() {
  const wrap = document.getElementById('gridWrap');
  gridEl = document.createElement('div');
  gridEl.className = 'grid';
  appendBlock(0); // initial 0(1..100)
  wrap.appendChild(gridEl);
}

function appendBlock(blockIndex){
  // Append 100 cells for this block. Labels: x(N) where x = blockIndex and N = global number
  for(let i=1;i<=100;i++){
    const global = blockIndex*100 + i;
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.overall = global; // numeric identity used for detection
    cell.dataset.block = blockIndex;
    // display the actual global number so users can easily read and the search can match
    cell.textContent = `${global}`;
    gridEl.appendChild(cell);
  }
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function runScan(targetNumber){
  const loading = document.getElementById('loadingText');
  const startBtn = document.getElementById('startScan');
  const resetBtn = document.getElementById('resetScan');
  startBtn.disabled = true; resetBtn.disabled = true;

  loading.textContent = 'Calculating using quantum deep-learning hyper-search protocol…';
  scanController.running = true;

  const delay = 35; // ms per number — intentionally dramatic but brief
  let previous = null;
  let blockIndex = 0;

  // infinite loop until reset is pressed
  while(scanController.running){
    // ensure block exists
    // if grid doesn't yet have this block (i.e., not enough children), append
    const expectedCells = (blockIndex+1)*100;
    while(gridEl.children.length < expectedCells){
      appendBlock(blockIndex);
    }

    for(let i=1;i<=100;i++){
      if(!scanController.running) break;
      const global = blockIndex*100 + i;
      const el = gridEl.querySelector(`.cell[data-overall='${global}']`);
      if(!el) continue;

      loading.textContent = `Checking ${global}…`;
      if(previous) previous.classList.remove('highlight');
      el.classList.add('highlight');
      previous = el;
      el.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
      await sleep(delay);

      // Only stop if the user-entered number is exactly 13 and we've reached 13.
      // If the entered number is not 13, continue scanning indefinitely (until Reset).
      if(typeof targetNumber === 'number' && targetNumber === 13 && global === 13){
        loading.textContent = `${targetNumber} detected: mission complete.`;
        scanController.running = false;
        break;
      }
    }

    if(!scanController.running) break;
    // after finishing this 1..100 block, indicate going further and pause
    if(!scanController.running) break;
    loading.textContent = 'Going further…';
    await sleep(1000);
    blockIndex++;
    // append next block ahead of time to avoid flicker
    appendBlock(blockIndex);
  }

  startBtn.disabled = false; resetBtn.disabled = false;
}

function resetGrid(){
  // stop scanning
  scanController.running = false;
  // remove highlights
  document.querySelectorAll('.cell.highlight').forEach(c=>c.classList.remove('highlight'));
  document.getElementById('loadingText').textContent = 'Idle';
}

function wireUI(){
  document.getElementById('startScan').addEventListener('click',()=>{
    // start infinite scan (user can stop with Reset)
    if(scanController.running) return;
    const val = document.getElementById('numInput').value;
    const n = parseInt(val, 10);
    if(Number.isNaN(n) || n < 1){
      alert('Please enter a valid number (1 or greater)');
      return;
    }
    // pass the target number so the scanner stops when it's found
    runScan(n);
  });

  document.getElementById('resetScan').addEventListener('click',()=>resetGrid());

  document.getElementById('numInput').addEventListener('keydown',(e)=>{
    if(e.key === 'Enter') document.getElementById('startScan').click();
  });

  // CTA placeholders
  document.getElementById('buyBtn').addEventListener('click',()=>{
    // Redirect to product page
    window.location.href = 'product.html';
  });
  document.getElementById('sourceBtn').addEventListener('click',()=>{
    window.open('https://github.com/My-Mation/13checker','_blank');
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  createCarousel();
  createGrid();
  wireUI();
});
