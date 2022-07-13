function controlledRandomRgba(r, g, b) {
  const randomR = (r + (Math.floor(Math.random() * 47))) % 1000;
  const randomG = (g + (Math.floor(Math.random() * 71))) % 1000;
  const randomB = (b + (Math.floor(Math.random() * 93))) % 1000;

  return `rgba(${randomR}, ${randomG}, ${randomB}, 0.4)`;
}

function randomRgba() {
  let o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

function getUrl(problem) {
  let contest = problem.split('-')[0];
  let index = problem.split('-')[1];

  let url = '';
  if (contest.length <= 4)
    url = 'https://codeforces.com/contest/' + contest + '/problem/' + index;
  else url = 'https://codeforces.com/problemset/gymProblem/' + contest + '/' + index;

  return url;
}


export {
  controlledRandomRgba,
  randomRgba,
  getUrl,
}
