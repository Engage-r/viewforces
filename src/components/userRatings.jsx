import React, {useEffect, useState} from "react";

import {Line} from 'react-chartjs-2';
import monthNames from "../utils/constants";

import 
{
  Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options={
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 6,
      },
      grid: {
        color: '#163a66'
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 10,
      },
      grid: {
        color: "#163a66"
      },

    }
  },
};

const UserRatings = ({ratingsData}) => {
  const [isFetchingData, setIsFetchingData] = useState(true);

  // states related to charts
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  const getLabels = (data) => {
    return data.map(rating => {
      const date = new Date(rating.ratingUpdateTimeSeconds * 1000);  // convert seconds to datetime object
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    });
  }

  const getData = (data) => {
    return data.map(rating => rating.newRating);
  }

  useEffect(() => {
    if (isFetchingData) {
      setChartLabels(getLabels(ratingsData));
      setChartData(getData(ratingsData));
      setIsFetchingData(false);
    }
  }, []);

  return (
    <Line
      options={options}
      data={{
        labels: chartLabels,
        datasets: [{
          label: "User Rating",
          data: chartData,
          borderColor: '#0680ef',
          backgroundColor: '#0680aa',
        }],
      }}
    />
  );
}

export default UserRatings;