import fs from 'fs';
const content = fs.readFileSync('src/components/UserDashboard.tsx', 'utf8');
const lines = content.split('\n');

// We need to find the showAddForm ternary closure.
// Let's search for </motion.div> around the middle of the file.

let targetIndex = -1;
for (let i = 1500; i < lines.length; i++) {
  if (lines[i].includes('</motion.div>') && lines[i+1]?.includes(') : (')) {
    targetIndex = i;
    break;
  }
}

if (targetIndex !== -1) {
  console.log(`Found target at ${targetIndex}`);
  // We want to replace everything from line 1715 (in previous view) to lines[targetIndex]
  // Let's just fix the block right before targetIndex.
  
  const replacement = [
    '                              </div>',
    '                           </div>',
    '                        </div>',
    '                     </div>',
    '                  </div>',
    '           </motion.div>'
  ];
  
  // Replace the 6 lines before targetIndex + the targetIndex itself
  lines.splice(targetIndex - 6, 7, ...replacement);
  fs.writeFileSync('src/components/UserDashboard.tsx', lines.join('\n'));
  console.log('Fixed structure v3');
} else {
  console.log('Target not found');
}
