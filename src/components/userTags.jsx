import React, {useEffect, useRef, useState} from "react";
import {Doughnut} from 'react-chartjs-2';
import {randomRgba} from "../utils/helper";
import Grid from '@mui/material/Grid';

import {Chart as ChartJS,ArcElement} from 'chart.js';

ChartJS.register(ArcElement);

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    ul.style.flexDirection = 'column';

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';
      li.style.marginBottom = '5px';

      li.onclick = () => {
        const {type} = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.color = "#ede2ce";
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  }
};


const UserTags = ({dataset}) => {
  // states related to charts
  const [tagsData, setTagsData] = useState({});
  const [backgroundColors, setBackgroundColors] = useState([]);

  useEffect(() => {
    if (!Object.keys(tagsData).length) {
      const tags = {};
      const colors = [];

      dataset.map(contestData => {
        contestData.problem.tags.map(tagName => {
          if (tags[tagName]) {
            tags[tagName] += 1;
          } else {
            tags[tagName] = 1;
          }
        })
      });

      Array.from({length: 15}, (x, i) => {
        colors.push(randomRgba());
      });

      setBackgroundColors(colors);
      setTagsData(tags);
    }
  }, [tagsData]);

  return (
    (
      <Grid style={{marginLeft: 10}} container spacing={2}>
        <Grid item xs={6}>
          <Doughnut
            data={{
              labels: Object.keys(tagsData),
              datasets: [
                {
                  //label: 'Tags',
                  data: Object.values(tagsData),
                  backgroundColor: backgroundColors,
                  borderWidth: 0.3,
                  borderColor:"black"
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
                htmlLegend: {
                  // ID of the container to put the legend in
                  containerID: 'legend-container',
                  
                },
              }
            }}
            plugins={[htmlLegendPlugin]}
          />
        </Grid>
        <Grid item xs={6}>
          <div id="legend-container"/>
        </Grid>
      </Grid>
    )
  );
}

export default UserTags;