# Screen and motion manifest

All frames 1080×1920, full screen, no crop. Stable theme: #091D20 / #102C30 with LangMind cyan/lime. Header x80 y235; main content x75..1005 y355..1415; caption x70 y1630 w940 h132. Original logo keeps aspect with white backing. Source assets unchanged.

|ID|Start|Duration|Screen/state|Exact title|Motion|
|---|---:|---:|---|---|---|
|b01-1|0.000|9.333|chat/answer|ใช้ AI ช่วยร่างข้อความอยู่แล้ว?|Browser entrance; persistent thread; wait/error/follow state|
|b01-2|9.333|11.100|hero|ถ้าเป็นเว็บของทีมเราเองล่ะ?|Panel entrance; robot reaction|
|b02-1|20.433|8.200|chat/answer|ช่วยทีมร่างข้อความ|Browser entrance; persistent thread; wait/error/follow state|
|b02-2|28.633|7.133|chat/follow|ขอฉบับสั้นสำหรับ LINE|Browser entrance; persistent thread; wait/error/follow state|
|b03-1|35.767|21.233|flow|ข้อความเดินทางผ่าน 3 ส่วน|Sequential frontend/server/Agent; return cue|
|b04-1|57.000|7.067|cards|ตั้งหน้าที่ให้ผู้ช่วยก่อน|Staggered panels|
|b04-2|64.067|12.667|cards|สองรหัส ใช้คนละหน้าที่|Staggered panels|
|b05-1|76.733|6.267|footage|สร้าง key สำหรับแอปนี้|Name typing / expiry / checkbox and cursor|
|b05-2|83.000|3.000|footage|เลือกอายุการใช้งาน|Name typing / expiry / checkbox and cursor|
|b05-3|86.000|10.667|footage|เลือกสิทธิ์ที่ต้องใช้|Name typing / expiry / checkbox and cursor|
|b05-4|96.667|5.367|code|นำ key ไปตั้งค่า server|Syntax and active line highlight|
|b06-1|102.033|8.533|code|ตั้งค่าฝั่ง server|Syntax and active line highlight|
|b06-2|110.567|12.867|agent|คัดลอกเฉพาะหลัง /agents/|Browser URL and ID emphasis|
|b06-3|123.433|6.567|code|โค้ด server อ่านค่าตั้งต้น|Syntax and active line highlight|
|b07-1|130.000|1.000|chat/wait|กดส่งจากหน้าเว็บ|Browser entrance; persistent thread; wait/error/follow state|
|b07-2|131.000|9.533|code|/api/chat เป็นของแอปเรา|Syntax and active line highlight|
|b07-3|140.533|7.067|flow|server เชื่อมให้ผู้ใช้|Sequential frontend/server/Agent; return cue|
|b08-1|147.600|7.833|code|ส่งคำขอไปที่ไหน?|Syntax and active line highlight|
|b08-2|155.433|8.133|code|ยืนยันสิทธิ์ตรงไหน?|Syntax and active line highlight|
|b08-3|163.567|9.167|code|ส่งข้อมูลอะไร?|Syntax and active line highlight|
|b09-1|172.733|5.500|code|ใช้ fetch ฝั่ง server|Syntax and active line highlight|
|b09-2|178.233|5.067|code|จับคู่ข้อมูลใน body|Syntax and active line highlight|
|b09-3|183.300|8.400|code|ตรวจผลก่อนอ่านคำตอบ|Syntax and active line highlight|
|b10-1|191.700|9.633|code|แสดงคำตอบ เก็บรหัสไว้|Syntax and active line highlight|
|b10-2|201.333|8.500|chat/answer|คำตอบกลับถึงหน้าเว็บ|Browser entrance; persistent thread; wait/error/follow state|
|b11-1|209.833|6.500|chat/wait|ระหว่างรอ กันการส่งซ้ำ|Browser entrance; persistent thread; wait/error/follow state|
|b11-2|216.333|6.400|chat/error|ถ้าส่งไม่สำเร็จ|Browser entrance; persistent thread; wait/error/follow state|
|b12-1|222.733|3.133|chat/followQ|ถามต่อในเรื่องเดิม|Browser entrance; persistent thread; wait/error/follow state|
|b12-2|225.867|14.867|diff|ใช้ conversation_id เดิม|null → previous conversation ID|
|b12-3|240.733|7.000|chat/follow|ได้ฉบับสั้นสำหรับ LINE|Browser entrance; persistent thread; wait/error/follow state|
|b13-1|247.733|5.300|chat/wait|ตัวอย่างนี้รอคำตอบครบ|Browser entrance; persistent thread; wait/error/follow state|
|b13-2|253.033|6.467|cards|ถ้าจะรับคำตอบเป็นช่วง|Staggered panels|
|b14-1|259.500|6.133|devices|ออกแบบให้เหมาะกับอุปกรณ์|Phone and workspace panels|
|b14-2|265.633|10.867|workspace|จอใหญ่ เพิ่มพื้นที่แก้ข้อความ|Chat and editable text areas|
|b15-1|276.500|12.300|cards|เปลี่ยนหน้าที่ แล้วต่อเติม|Staggered panels|
|b15-2|288.800|8.300|flow|จำวงจรหลักไว้|Sequential frontend/server/Agent; return cue|
|b15-3|297.100|6.500|hero|งานแรกของคุณคืออะไร?|Panel entrance; robot reaction|
|b16-1|303.600|6.833|logo|สร้างสิ่งต่อไป ในแบบของคุณ|Original logo and robot fade|
