"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
// 8192*2 (16384 aka 16KB) is the highWaterMark (aka buffer size?)
const node_process = child_process_1.spawn("node", ["-e", "process.stdout.write('a'.repeat(8192*8+2));setTimeout(()=>{console.log('done')},4000)"]);
node_process.on('error', err => console.error(err));
let numFlushes = 0;
node_process.stdout.on('data', (buffer) => {
    numFlushes += 1;
    const str = buffer.toString();
    console.log(`flush number: ${numFlushes}\
    Buffer length: ${buffer.length}`);
    if (buffer.length < 20)
        console.log(str);
});
/*
Expected result: 3 flushes, one when highWaterMark is reached, another with rest of stdout, final with done log
Acutal result: 2 flushes. All of stdout is recieved at once. 4 seconds later comes the done log.
Related docs: https://nodejs.org/docs/latest-v12.x/api/stream.html#stream_buffering
OUTPUT (courtesy of quokka)
flush number: 1    Buffer length: 16385
  at ​​​`flush number: ${ numFlushes }\ Buff...​​​ ​personal/test_node_buffer.ts:11:4
flush number: 2    Buffer length: 11
  at ​​​`flush number: ${ numFlushes }\ Buff...​​​ ​personal/test_node_buffer.ts:11:4
done
  at ​​​str​​​ ​personal/test_node_buffer.ts:13:8
*/ 
//# sourceMappingURL=test_node_buffer.js.map