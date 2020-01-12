const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

let getTestCaseFromProblemHtml = (dir, html) => {
  data = [];
  fs.copyFileSync(`${dir}/../template.cpp`, `${dir}/sol.cpp`);
  const $ = cheerio.load(html);
  $('div.input').each((i, elem) => {
    data[i] = {
      ...data[i],
      input: $(elem).text().substring('Input'.length),
    };
  });
  $('div.output').each((i, elem) => {
    data[i] = ({
      ...data[i],
      output: $(elem).text().substring('Output'.length),
    });
  });
  console.log(data);
  data.forEach((test, i) => {
    fs.writeFile(`${dir}/in${i}.txt`, test.input, function(err) {
      if(err) {
          console.log(err);
      }
      console.log(`The file ${dir}/in${i}.txt was saved!`);
    }); 
    fs.writeFile(`${dir}/out${i}.txt`, test.output, function(err) {
      if(err) {
          console.log(err);
      }
      console.log(`The file ${dir}/out${i}.txt was saved!`);
    }); 
  })
  console.log(data);
}

function getTestCaseFromProblemUrl(url) {
  var dir = `./${url[url.length-1]}`;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  axios.get(url)
    .then(response => {
      getTestCaseFromProblemHtml(dir, response.data);
    }
    )
    .catch(err => console.log(err));
}


let getTotalProblemsFromContestHtml = (html) => {
  data = [];
  const $ = cheerio.load(html);
  console.log('parsing');
  $('tr td.id a').each((i, elem) => {
    problem_url = 'https://codeforces.com/' + $(elem).attr('href')
    console.log(problem_url);
    getTestCaseFromProblemUrl(problem_url);
  });
}

axios.get(process.env.CF_CONTEST)
    .then(response => {
      getTotalProblemsFromContestHtml(response.data);
    });
