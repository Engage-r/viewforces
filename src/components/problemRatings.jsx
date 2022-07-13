import React, {useEffect, useState} from 'react';
import 
{
  Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        color: '#163a66'
      },
    },
    y: {
      grid: {
        color: "#163a66"
      },
    }
  },
};

const colors = [
  '#bababa', '#6ce96c', '#6dcbac', '#9a9de8', '#ea7de7', '#ED9064', '#9AC2B7', '#108376', '#e6ac50', '#E83521'
];

const ProblemRatings = ({dataset}) => {
  const [problemRating, setProblemRating] = useState({});

  const calculateRatings = () => {
    let ratings = {};
    let alreadyVisited = {};

    for (let i = dataset.length - 1; i >= 0; i--) {
      let sub = dataset[i];

      let rating = sub.problem.rating === undefined ? 0 : sub.problem.rating;
      let problemId = sub.problem.contestId + '-' + sub.problem.name + '-' + rating;

      if (sub.verdict === 'OK') {
        if (!alreadyVisited[problemId]) {
          alreadyVisited[problemId] = 1;
        } else {
          alreadyVisited[problemId]++;
        }

        if (alreadyVisited[problemId] === 1 && sub.problem.rating) {
          if (ratings[sub.problem.rating] === undefined) {
            ratings[sub.problem.rating] = 1;
          } else {
            ratings[sub.problem.rating]++;
          }
        }
      }
    }
    setProblemRating(ratings);
  }

  const getBackgroundColors = () => {
    const backgroundColors = [];
    Object.keys(problemRating).forEach(item => {
      const index = Math.floor(item/250);
      backgroundColors.push(colors[index > 9 ? 9 : index]);
    });
    return backgroundColors;
  }

  useEffect(() => {
    calculateRatings();
  }, []);

  return <Bar
    options={options}
    data={{
      labels: Object.keys(problemRating),
      datasets: [
        {
          label: 'Problems solved per rating',
          data: Object.values(problemRating),
          backgroundColor: getBackgroundColors(),
        },
      ],
    }}
  />;
}

export default ProblemRatings;