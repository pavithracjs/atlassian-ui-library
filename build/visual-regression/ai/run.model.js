// let {PythonShell} = require('python-shell');
const exec = require('child_process').execSync;
const arg = process.argv.slice(2);

const { execSync } = require('child_process');

(() => {
  execSync(
    'python3 ./build/visual-regression/ai/run_model.py --image ./build/visual-regression/ai/search.png',
  );
  // try{
  //   pythonProcess.stdout.on('data', function(data) {
  //     console.log('inside', data);
  //     console.log(data.toString());
  //     res.write(data);
  //     res.end('end');
  //   });
  // } catch(error){
  //   console.log(error);
  // }
})();

// async function runPy(){
//   let options = {
//   // mode: 'text',
//   // pythonOptions: ['-u'],
//   mode: 'text',
//   pythonPath: 'usr/local/bin/python2.7',
//   scriptPath: './run_model.py',//Path to your script
//   args: [JSON.stringify({"--image": arg[0]})]
//   };
//   console.log(options)
//   await PythonShell.run('run_model.py', options, function (err, results) {
//     console.log(err, results, options)
//     //On 'results' we get list of strings of all print done in your py scripts sequentially.
//     if (err) throw err;
//     console.log('results: ');
//       //       for(let i of results){
//       //             console.log(i, "---->", typeof i)
//       //       }
//       //   resolve(results[1])//I returned only JSON(Stringified) out of all string I got from py script
//       //  });
//    })
//  }

// ( async () => {
//  try {
//    console.log('I am here')
//   let r =  await runPy();
//   console.log(JSON.parse(JSON.stringify(r.toString())), "Done...!@")//Approach to parse string to JSON.

//  }
//  catch(err) {
//   console.log('I am erroring')
//    console.log(err);
//  }

// })();
