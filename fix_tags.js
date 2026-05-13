import fs from 'fs';
const content = fs.readFileSync('src/components/UserDashboard.tsx', 'utf8');
const lines = content.split('\n');
// Line 1592 is index 1591
lines.splice(1591, 6, 
"                       </div>",
"                    </div>",
"                 </div>",
"                </div>",
"               </div>",
"            </div>",
"          </motion.div>"
);
fs.writeFileSync('src/components/UserDashboard.tsx', lines.join('\n'));
