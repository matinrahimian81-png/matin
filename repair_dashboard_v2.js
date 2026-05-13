import fs from 'fs';
const content = fs.readFileSync('src/components/UserDashboard.tsx', 'utf8');
const lines = content.split('\n');

// Find limits
const startMarker = '<div className="space-y-6 pt-4 border-t border-gray-50">';
const endMarker = '{/* Controls Row */}';

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(startMarker) && startIndex === -1) {
    startIndex = i;
  }
  if (lines[i].includes(endMarker)) {
    endIndex = i;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  console.log(`Found markers at ${startIndex} and ${endIndex}`);
  
  const newStep2 = [
`               <div className="space-y-6 pt-4 border-t border-gray-50">`,
`                 <div className="flex items-center gap-3">`,
`                    <div className="w-8 h-8 bg-[#EF2020] text-white rounded-lg flex items-center justify-center font-black">۲</div>`,
`                    <h5 className="font-black text-gray-900">تعیین محل کلیک و متن دکمه</h5>`,
`                 </div>`,
``,
`                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">`,
`                    {/* Position Editor */}`,
`                    <div className="lg:col-span-12 space-y-4">`,
`                       <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">`,
`                           <span>محل قرارگیری باکس (باکس را در تصویر جابجا کنید)</span>`,
`                           <div className="flex gap-4">`,
`                              <span className="text-gray-400">X: {newSlide.button_pos_x}%</span>`,
`                              <span className="text-gray-400">Y: {newSlide.button_pos_y}%</span>`,
`                           </div>`,
`                       </div>`,
`                       `,
`                        <div className="relative w-full aspect-[21/9] bg-gray-50 rounded-[40px] shadow-2xl overflow-hidden group/hotspot border-4 border-white">`,
`                          <div `,
`                            className="absolute inset-0 z-0 cursor-crosshair"`,
`                            onClick={(e) => {`,
`                               const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();`,
`                               const x = ((rect.right - e.clientX) / rect.width) * 100;`,
`                               const y = ((e.clientY - rect.top) / rect.height) * 100;`,
`                               setNewSlide(prev => ({`,
`                                 ...prev,`,
`                                 button_pos_x: Number(Math.max(0, Math.min(100 - (prev.button_width || 15), x - (prev.button_width || 15) / 2)).toFixed(1)),`,
`                                 button_pos_y: Number(Math.max(0, Math.min(100 - (prev.button_height || 10), y - (prev.button_height || 10) / 2)).toFixed(1))`,
`                               }));`,
`                            }}`,
`                          >`,
`                             {image ? (`,
`                                <img src={image} className="w-full h-full object-cover opacity-50 contrast-125 pointer-events-none" alt="Positioning Preview" />`,
`                             ) : (`,
`                                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-700 text-sm font-black">ابتدا از مرحله ۱ تصویر را انتخاب کنید</div>`,
`                             )}`,
`                             <div className="absolute inset-0 bg-black/5 pointer-events-none" />`,
`                          </div>`,
``,
`                          {/* HOTSPOT / BUTTON BOX - DRAGGABLE & CROP-STYLE */}`,
`                           <motion.div`,
`                             drag`,
`                             dragMomentum={false}`,
`                             dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}`,
`                             onDrag={(e, info) => {`,
`                                const parent = (e.currentTarget as HTMLElement).parentElement;`,
`                                if (!parent) return;`,
`                                const rect = parent.getBoundingClientRect();`,
`                                const x = ((rect.right - info.point.x) / rect.width) * 100;`,
`                                const y = ((info.point.y - rect.top) / rect.height) * 100;`,
`                                setNewSlide(prev => ({`,
`                                  ...prev,`,
`                                  button_pos_x: Number(Math.max(0, Math.min(100 - (prev.button_width || 15), x)).toFixed(1)),`,
`                                  button_pos_y: Number(Math.max(0, Math.min(100 - (prev.button_height || 10), y)).toFixed(1))`,
`                                }));`,
`                             }}`,
`                             className="absolute border border-white/90 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] cursor-move z-10"`,
`                             style={{ `,
`                                 right: \`\${newSlide.button_pos_x}%\`, `,
`                                 top: \`\${newSlide.button_pos_y}%\`,`,
`                                 width: \`\${newSlide.button_width}%\`,`,
`                                 height: \`\${newSlide.button_height}%\`,`,
`                                 backgroundColor: 'rgba(255, 255, 255, 0.05)',`,
`                             }}`,
`                           >`,
`                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">`,
`                                <div className="border-r border-b border-white/40" />`,
`                                <div className="border-r border-b border-white/40" />`,
`                                <div className="border-b border-white/40" />`,
`                                <div className="border-r border-b border-white/40" />`,
`                                <div className="border-r border-b border-white/40" />`,
`                                <div className="border-b border-white/40" />`,
`                                <div className="border-r border-white/40" />`,
`                                <div className="border-r border-white/40" />`,
`                                <div />`,
`                              </div>`,
`                              `,
`                              <div className="absolute inset-0 pointer-events-none">`,
`                                <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-[3px] border-r-[3px] border-white shadow-sm" />`,
`                                <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-[3px] border-l-[3px] border-white shadow-sm" />`,
`                                <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-[3px] border-r-[3px] border-white shadow-sm" />`,
`                                <div className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-[3px] border-l-[3px] border-white shadow-sm" />`,
``,
`                                <div `,
`                                  className="absolute bottom-[-10px] left-[-10px] w-10 h-10 cursor-nesw-resize pointer-events-auto z-20"`,
`                                  onPointerDown={(e) => {`,
`                                    e.stopPropagation();`,
`                                    const startX = e.clientX;`,
`                                    const startY = e.clientY;`,
`                                    const startW = newSlide.button_width || 15;`,
`                                    const startH = newSlide.button_height || 10;`,
`                                    const container = e.currentTarget.parentElement?.parentElement;`,
`                                    `,
`                                    const onMove = (moveEvent: PointerEvent) => {`,
`                                      if (!container) return;`,
`                                      const rect = container.parentElement?.getBoundingClientRect();`,
`                                      if (!rect) return;`,
`                                      `,
`                                      const deltaPxX = startX - moveEvent.clientX;`,
`                                      const deltaPxY = moveEvent.clientY - startY;`,
`                                      `,
`                                      const deltaW = (deltaPxX / rect.width) * 100;`,
`                                      const deltaH = (deltaPxY / rect.height) * 100;`,
`                                      `,
`                                      setNewSlide(prev => ({`,
`                                        ...prev,`,
`                                        button_width: Number(Math.max(5, Math.min(100 - (prev.button_pos_x || 0), startW + deltaW)).toFixed(1)),`,
`                                        button_height: Number(Math.max(5, Math.min(100 - (prev.button_pos_y || 0), startH + deltaH)).toFixed(1))`,
`                                      }));`,
`                                    };`,
`                                    `,
`                                    const onUp = () => {`,
`                                      window.removeEventListener('pointermove', onMove);`,
`                                      window.removeEventListener('pointerup', onUp);`,
`                                    };`,
`                                    `,
`                                    window.addEventListener('pointermove', onMove);`,
`                                    window.addEventListener('pointerup', onUp);`,
`                                  }}`,
`                                />`,
`                              </div>`,
``,
`                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">`,
`                                <Move className="w-5 h-5 text-white drop-shadow-md opacity-60" />`,
`                              </div>`,
`                           </motion.div>`,
``,
`                          <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-xl text-[9px] font-black text-white border border-white/20 pointer-events-none z-20">`,
`                             باکس را بکشید یا برای جابجایی سریع روی تصویر کلیک کنید`,
`                          </div>`,
`                       </div>`
  ];

  lines.splice(startIndex, endIndex - startIndex, ...newStep2);
  fs.writeFileSync('src/components/UserDashboard.tsx', lines.join('\n'));
  console.log('Repair complete');
} else {
  console.log('Markers not found');
}
